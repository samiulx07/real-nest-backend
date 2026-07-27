import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateRequest(registerSchema), authController.registerUser);
router.post("/login", validateRequest(loginSchema), authController.loginUser);
router.post("/refresh", validateRequest(refreshTokenSchema), authController.refreshToken);
router.get("/me", authMiddleware(), authController.getMe);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), authController.resetPassword);

export default router;
