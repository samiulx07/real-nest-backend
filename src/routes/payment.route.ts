import { Router } from "express";
import {
  handleSSLSuccess,
  handleSSLFail,
  handleSSLCancel,
  handleSSLIPN,
} from "../controllers/payment.controller";

const router = Router();

// SSLCommerz Callbacks
router.post("/ssl-success", handleSSLSuccess);
router.get("/ssl-success", handleSSLSuccess);

router.post("/ssl-fail", handleSSLFail);
router.get("/ssl-fail", handleSSLFail);

router.post("/ssl-cancel", handleSSLCancel);
router.get("/ssl-cancel", handleSSLCancel);

router.post("/ssl-ipn", handleSSLIPN);

export default router;
