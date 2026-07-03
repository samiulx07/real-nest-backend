"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const asyncHandler_1 = require("../utils/asyncHandler");
const authMiddleware = (...requiredRoles) => {
    return (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        // 1. Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError_1.ApiError(401, "You are not logged in. Please provide a valid token.");
        }
        const token = authHeader.split(" ")[1];
        // 2. Verify token
        try {
            const decoded = (0, jwt_1.verifyToken)(token, env_1.env.JWT_ACCESS_SECRET);
            // 3. Check if user role is authorized
            if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
                throw new ApiError_1.ApiError(403, "You do not have permission to access this resource");
            }
            req.user = decoded;
            next();
        }
        catch (err) {
            throw new ApiError_1.ApiError(401, "Invalid or expired access token");
        }
    });
};
exports.authMiddleware = authMiddleware;
