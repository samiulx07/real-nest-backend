import { Router } from "express";
import {
  handleSSLSuccess,
  handleSSLFail,
  handleSSLCancel,
  handleSSLIPN,
  approvePayment,
  rejectPayment,
} from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// SSLCommerz Callbacks
router.post("/ssl-success", handleSSLSuccess);
router.get("/ssl-success", handleSSLSuccess);

router.post("/ssl-fail", handleSSLFail);
router.get("/ssl-fail", handleSSLFail);

router.post("/ssl-cancel", handleSSLCancel);
router.get("/ssl-cancel", handleSSLCancel);

router.post("/ssl-ipn", handleSSLIPN);

// Protected Admin Approvals
router.patch("/:id/approve", authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"), approvePayment);
router.patch("/:id/reject", authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"), rejectPayment);

export default router;
