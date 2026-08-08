import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/summary", authMiddleware(), analyticsController.getDashboardSummary);

export default router;
