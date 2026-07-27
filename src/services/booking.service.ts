import prisma from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { SSLCommerzService } from "./sslcommerz.service";

export interface CreateBookingDTO {
  flatId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingAmount: number;
  notes?: string;

  paymentMethod: "SSLCOMMERZ" | "BANK_TRANSFER" | "BKASH" | "NAGAD" | "CASH";
  senderAccount?: string;
  bankTranId?: string;
  receiptUrl?: string;
}

export const createBookingService = async (userId: string, payload: CreateBookingDTO) => {
  // 1. Check if Flat exists and is available
  const flat = await prisma.flat.findUnique({
    where: { id: payload.flatId },
    include: { property: true },
  });

  if (!flat) {
    throw new ApiError(404, "Target flat unit not found");
  }

  if (flat.status === "BOOKED" || flat.status === "SOLD") {
    throw new ApiError(400, `Flat unit ${flat.flatNumber} is already ${flat.status.toLowerCase()}`);
  }

  // 2. Generate unique booking number
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randCode = Math.floor(1000 + Math.random() * 9000);
  const bookingNumber = `BK-${dateStr}-${randCode}`;
  const tranId = `TXN-${dateStr}-${randCode}`;

  // 3. If paymentMethod is SSLCOMMERZ, initiate gateway session
  if (payload.paymentMethod === "SSLCOMMERZ") {
    const newBooking = await prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          userId,
          flatId: payload.flatId,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          bookingAmount: payload.bookingAmount,
          paidAmount: 0,
          paymentStatus: "PENDING_APPROVAL",
          status: "PENDING",
          notes: payload.notes,
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          tranId,
          bookingId: booking.id,
          userId,
          paymentMethod: "SSLCOMMERZ",
          amount: payload.bookingAmount,
          currency: "BDT",
          status: "PENDING_APPROVAL",
        },
      });

      // Update flat status to RESERVED
      await tx.flat.update({
        where: { id: payload.flatId },
        data: { status: "RESERVED" },
      });

      return booking;
    });

    const sslSession = await SSLCommerzService.initiateSession({
      bookingId: newBooking.id,
      tranId,
      amount: payload.bookingAmount,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      flatTitle: `${flat.property?.title || "Building"} - Unit ${flat.flatNumber}`,
    });

    return {
      booking: newBooking,
      gatewayUrl: sslSession.gatewayUrl,
      paymentMethod: "SSLCOMMERZ",
    };
  }

  // 4. For Bank Transfer / Mobile Payments
  const newBooking = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        bookingNumber,
        userId,
        flatId: payload.flatId,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        bookingAmount: payload.bookingAmount,
        paidAmount: payload.bookingAmount, // Submitted deposit
        paymentStatus: "PENDING_APPROVAL",
        status: "PENDING",
        notes: payload.notes,
      },
    });

    await tx.payment.create({
      data: {
        tranId,
        bookingId: booking.id,
        userId,
        paymentMethod: payload.paymentMethod,
        amount: payload.bookingAmount,
        currency: "BDT",
        bankTranId: payload.bankTranId || tranId,
        senderAccount: payload.senderAccount,
        receiptUrl: payload.receiptUrl,
        status: "PENDING_APPROVAL",
      },
    });

    await tx.flat.update({
      where: { id: payload.flatId },
      data: { status: "RESERVED" },
    });

    return booking;
  });

  return {
    booking: newBooking,
    paymentMethod: payload.paymentMethod,
  };
};

export const getUserBookingsService = async (userId: string) => {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      flat: {
        include: {
          property: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllBookingsService = async () => {
  return prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
      flat: {
        include: {
          property: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const verifyBookingPaymentService = async (
  bookingId: string,
  action: "APPROVE" | "REJECT",
  adminNotes?: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payments: true, flat: true },
  });

  if (!booking) {
    throw new ApiError(404, "Booking record not found");
  }

  if (action === "APPROVE") {
    return prisma.$transaction(async (tx) => {
      // 1. Update Booking
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "VALIDATED",
          paidAmount: booking.bookingAmount,
          adminNotes,
        },
      });

      // 2. Update Payments
      await tx.payment.updateMany({
        where: { bookingId },
        data: {
          status: "VALIDATED",
          adminNotes,
        },
      });

      // 3. Update Flat to BOOKED
      await tx.flat.update({
        where: { id: booking.flatId },
        data: { status: "BOOKED" },
      });

      return updatedBooking;
    });
  }

  // REJECT Action
  return prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        paymentStatus: "REJECTED",
        adminNotes,
      },
    });

    await tx.payment.updateMany({
      where: { bookingId },
      data: {
        status: "REJECTED",
        adminNotes,
      },
    });

    // Revert flat to AVAILABLE
    await tx.flat.update({
      where: { id: booking.flatId },
      data: { status: "AVAILABLE" },
    });

    return updatedBooking;
  });
};
