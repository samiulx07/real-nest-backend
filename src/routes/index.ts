import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy!" });
});

// Import routes
import authRoutes from "./auth.route";
import propertyRoutes from "./property.route";
import flatRoutes from "./flat.route";

// Mount routes
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/flats", flatRoutes);

export default router;

