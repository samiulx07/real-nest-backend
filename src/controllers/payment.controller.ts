import { Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { SSLCommerzService } from "../services/sslcommerz.service";
import { env, getPrimaryFrontendUrl } from "../config/env";

export const handleSSLSuccess = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body || {};
  const query = req.query || {};

  const val_id = body.val_id || query.val_id;
  const card_type = body.card_type || query.card_type;
  const bank_tran_id = body.bank_tran_id || query.bank_tran_id;
  const tranId = (query.tranId as string) || body.tran_id || (query.tran_id as string);
  const bookingId = (query.bookingId as string) || body.value_a;

  const clientUrl = getPrimaryFrontendUrl();

  try {
    let isValid = false;
    let valData: any = {};

    const isLive = env.SSLCOMMERZ_IS_LIVE === "true";

    if (val_id) {
      try {
        valData = await SSLCommerzService.validateTransaction(val_id);
        if (valData?.status === "VALID" || valData?.status === "VALIDATED") {
          isValid = true;
        } else if (!isLive && valData?.status === "INVALID_TRANSACTION") {
          // Sandbox test environment fallback
          isValid = true;
        }
      } catch (valErr) {
        console.warn("SSLCommerz validator notice:", valErr);
        if (!isLive) isValid = true;
      }
    } else if (!isLive) {
      // In sandbox mode without val_id, trust form POST fallback
      isValid = true;
    }

    if (isValid) {
      // Find payment by tranId
      let payment = tranId ? await prisma.payment.findFirst({ where: { tranId } }) : null;
      let targetBookingId = payment?.bookingId || bookingId;

      if (!targetBookingId && tranId) {
        payment = await prisma.payment.findFirst({ where: { tranId }, include: { booking: true } });
        targetBookingId = payment?.bookingId || "";
      }

      // Security check: Validate paid currency_amount against database payment record
      if (payment && valData?.currency_amount) {
        const validatedAmount = Number(valData.currency_amount);
        const expectedAmount = Number(payment.amount);

        if (validatedAmount < expectedAmount) {
          console.error(`SECURITY WARNING: Amount mismatch! Validated: ${validatedAmount}, Expected: ${expectedAmount}`);
          return res.redirect(`${clientUrl}/dashboard/my-bookings?payment=failed&reason=amount_mismatch`);
        }
      }

      if (targetBookingId) {
        await prisma.$transaction(async (tx) => {
          const booking = await tx.booking.update({
            where: { id: targetBookingId },
            data: {
              status: "CONFIRMED",
              paymentStatus: "VALIDATED",
              paidAmount: payment?.amount || undefined,
            },
          });

          if (payment) {
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                valId: val_id || valData?.val_id || "SANDBOX_VAL_ID",
                cardType: card_type || valData?.card_type || "SSLCOMMERZ",
                bankTranId: bank_tran_id || valData?.bank_tran_id || tranId,
                status: "VALIDATED",
                paymentDetails: body,
              },
            });
          }

          if (booking?.flatId) {
            await tx.flat.update({
              where: { id: booking.flatId },
              data: { status: "BOOKED" },
            });
          }
        });
      }

      return res.redirect(`${clientUrl}/dashboard/my-bookings?payment=success&tran_id=${tranId || "SUCCESS"}`);
    }

    return res.redirect(`${clientUrl}/dashboard/my-bookings?payment=failed&reason=invalid_transaction`);
  } catch (err) {
    console.error("SSLCommerz Callback Error:", err);
    return res.redirect(`${clientUrl}/dashboard/my-bookings?payment=failed`);
  }
});

export const handleSSLFail = asyncHandler(async (req: Request, res: Response) => {
  const tranId = (req.query.tranId as string) || req.body?.tran_id;
  const clientUrl = getPrimaryFrontendUrl();

  if (tranId) {
    await prisma.payment.updateMany({
      where: { tranId },
      data: { status: "FAILED" },
    });
  }

  return res.redirect(`${clientUrl}/dashboard/my-bookings?payment=failed`);
});

export const handleSSLCancel = asyncHandler(async (req: Request, res: Response) => {
  const tranId = (req.query.tranId as string) || req.body?.tran_id;
  const clientUrl = getPrimaryFrontendUrl();

  if (tranId) {
    const payment = await prisma.payment.findFirst({ where: { tranId } });
    if (payment) {
      const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
      await prisma.$transaction([
        prisma.payment.update({ where: { id: payment.id }, data: { status: "CANCELLED" } }),
        prisma.booking.update({ where: { id: payment.bookingId }, data: { status: "CANCELLED" } }),
        ...(booking?.flatId
          ? [prisma.flat.update({ where: { id: booking.flatId }, data: { status: "AVAILABLE" } })]
          : []),
      ]);
    }
  }

  return res.redirect(`${clientUrl}/dashboard/my-bookings?payment=cancelled`);
});

export const handleSSLIPN = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "IPN Received" });
});

export const approvePayment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    return res.status(404).json({ success: false, message: "Payment record not found" });
  }

  const booking = payment.bookingId
    ? await prisma.booking.findUnique({ where: { id: payment.bookingId } })
    : null;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id },
      data: { status: "VALIDATED" },
    });

    if (payment.bookingId) {
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "VALIDATED",
          paidAmount: payment.amount,
        },
      });

      if (booking?.flatId) {
        await tx.flat.update({
          where: { id: booking.flatId },
          data: { status: "BOOKED" },
        });
      }
    }
  });

  res.status(200).json({ success: true, message: "Payment approved and verified successfully" });
});

export const rejectPayment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { adminNotes } = req.body || {};

  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    return res.status(404).json({ success: false, message: "Payment record not found" });
  }

  const booking = payment.bookingId
    ? await prisma.booking.findUnique({ where: { id: payment.bookingId } })
    : null;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id },
      data: { status: "REJECTED", adminNotes },
    });

    if (payment.bookingId) {
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: "CANCELLED",
          paymentStatus: "REJECTED",
          adminNotes,
        },
      });

      if (booking?.flatId) {
        await tx.flat.update({
          where: { id: booking.flatId },
          data: { status: "AVAILABLE" },
        });
      }
    }
  });

  res.status(200).json({ success: true, message: "Payment rejected successfully" });
});
