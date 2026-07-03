"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.globalErrorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorMessages = [];
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessages = [{ path: "", message: err.message }];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorMessages = [{ path: "", message: err.message }];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: env_1.env.NODE_ENV !== "production" ? err?.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
        errorMessages: [{ path: req.originalUrl, message: "API endpoint not found" }],
    });
};
exports.notFoundHandler = notFoundHandler;
