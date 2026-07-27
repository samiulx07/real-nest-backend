import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  createBookingValidation,
  updateBookingStatusValidation,
} from "../validations/booking.validation";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  verifyBookingPayment,
} from "../controllers/booking.controller";

const router = Router();

// Customer endpoints
router.post(
  "/",
  authMiddleware(),
  validateRequest(createBookingValidation),
  createBooking
);

router.get(
  "/my-bookings",
  authMiddleware(),
  getUserBookings
);

// Admin / Staff endpoints
router.get(
  "/",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  getAllBookings
);

router.patch(
  "/:id/verify-payment",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  validateRequest(updateBookingStatusValidation),
  verifyBookingPayment
);

export default router;
