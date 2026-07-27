import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy!" });
});

// Import routes
import authRoutes from "./auth.route";
import propertyRoutes from "./property.route";
import flatRoutes from "./flat.route";
import mediaRoutes from "./media.route";
import bookingRoutes from "./booking.route";
import paymentRoutes from "./payment.route";

// Mount routes
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/flats", flatRoutes);
router.use("/media", mediaRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);

export default router;

