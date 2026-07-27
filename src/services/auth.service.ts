import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { createToken, verifyToken } from "../utils/jwt";
import { env } from "../config/env";

export const registerUser = async (payload: any) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(payload.password, salt);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newUser;
};

export const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "User account is inactive");
  }

  // Create tokens
  const jwtPayload = { id: user.id, email: user.email, role: user.role };
  
  const accessToken = createToken(jwtPayload, env.JWT_ACCESS_SECRET, "1d");
  const refreshToken = createToken(jwtPayload, env.JWT_REFRESH_SECRET, "365d");

  // Exclude password from response
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (token: string) => {
  let decodedToken;
  try {
    decodedToken = verifyToken(token, env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { email: decodedToken.email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const jwtPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, env.JWT_ACCESS_SECRET, "1d");

  return { accessToken };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(404, "No account found with this email address");
  }

  // Generate 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiration to 10 minutes from now
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // Save OTP and expiration to DB
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetOtp: otpCode,
      passwordResetOtpExpires: otpExpires,
    },
  });

  // Construct reset link URL
  const resetLink = `${env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(user.email)}`;

  // Send email via Resend
  const { sendOtpResetEmail } = await import("../utils/sendEmail");
  const emailResult = await sendOtpResetEmail({
    to: user.email,
    userName: user.fullName,
    otpCode,
    resetLink,
  });

  if (!emailResult.success) {
    throw new ApiError(500, `Email delivery failed: ${emailResult.error}`);
  }

  return {
    message: "An OTP reset code and link have been sent to your email address.",
  };
};

export const resetPassword = async (payload: {
  email: string;
  otpCode: string;
  newPassword: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  if (
    !user.passwordResetOtp ||
    !user.passwordResetOtpExpires ||
    user.passwordResetOtp !== payload.otpCode ||
    new Date() > new Date(user.passwordResetOtpExpires)
  ) {
    throw new ApiError(400, "Invalid or expired OTP code");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(payload.newPassword, salt);

  // Update password and clear reset fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetOtp: null,
      passwordResetOtpExpires: null,
    },
  });

  return {
    message: "Password has been reset successfully. You can now log in with your new password.",
  };
};
