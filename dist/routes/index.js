"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy!" });
});
// Import routes
const auth_route_1 = __importDefault(require("./auth.route"));
// Mount routes
router.use("/auth", auth_route_1.default);
exports.default = router;
