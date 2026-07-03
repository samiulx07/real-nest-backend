"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.refreshToken = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const registerUser = async (payload) => {
    // Check if user exists
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new ApiError_1.ApiError(400, "User with this email already exists");
    }
    // Hash password
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(payload.password, salt);
    // Create user
    const newUser = await prisma_1.default.user.create({
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
exports.registerUser = registerUser;
const loginUser = async (payload) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const isPasswordMatched = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.ApiError(401, "Invalid password");
    }
    if (!user.isActive) {
        throw new ApiError_1.ApiError(403, "User account is inactive");
    }
    // Create tokens
    const jwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = (0, jwt_1.createToken)(jwtPayload, env_1.env.JWT_ACCESS_SECRET, "1d");
    const refreshToken = (0, jwt_1.createToken)(jwtPayload, env_1.env.JWT_REFRESH_SECRET, "365d");
    // Exclude password from response
    const { password, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    };
};
exports.loginUser = loginUser;
const refreshToken = async (token) => {
    let decodedToken;
    try {
        decodedToken = (0, jwt_1.verifyToken)(token, env_1.env.JWT_REFRESH_SECRET);
    }
    catch (err) {
        throw new ApiError_1.ApiError(401, "Invalid or expired refresh token");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { email: decodedToken.email },
    });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const jwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = (0, jwt_1.createToken)(jwtPayload, env_1.env.JWT_ACCESS_SECRET, "1d");
    return { accessToken };
};
exports.refreshToken = refreshToken;
const getMe = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
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
        throw new ApiError_1.ApiError(404, "User not found");
    }
    return user;
};
exports.getMe = getMe;
