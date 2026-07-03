"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = __importDefault(require("./config/prisma"));
let server;
async function bootstrap() {
    try {
        // Attempt database connection
        await prisma_1.default.$connect();
        console.log("🛢️Connected to the database successfully");
        server = app_1.default.listen(env_1.env.PORT, () => {
            console.log(`🚀 Server is running on port ${env_1.env.PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to start server", err);
        process.exit(1);
    }
}
bootstrap();
// Handle unhandled rejections gracefully
process.on("unhandledRejection", (err) => {
    console.log("😈 unhandledRejection is detected, shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// Handle uncaught exceptions gracefully
process.on("uncaughtException", (err) => {
    console.log("😈 uncaughtException is detected, shutting down...");
    process.exit(1);
});
