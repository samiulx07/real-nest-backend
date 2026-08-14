import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";
import {
  createBookingService,
  getUserBookingsService,
  getAllBookingsService,
  verifyBookingPaymentService,
  payInstallmentService,
} from "../services/booking.service";

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await createBookingService(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Flat booking request created successfully",
    data: result,
  });
});

export const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const bookings = await getUserBookingsService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User bookings fetched successfully",
    data: bookings,
  });
});

export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await getAllBookingsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All bookings fetched successfully",
    data: bookings,
  });
});

export const verifyBookingPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, adminNotes } = req.body;

  const result = await verifyBookingPaymentService(id as string, action, adminNotes);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Booking payment ${action.toLowerCase()}d successfully`,
    data: result,
  });
});

export const payInstallment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const payload = {
    ...req.body,
    bookingId: id as string,
  };

  const result = await payInstallmentService(userId, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Installment payment submitted successfully",
    data: result,
  });
});
