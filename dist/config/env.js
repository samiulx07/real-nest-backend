"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
const envVarsZodSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.string().default("5000"),
    DATABASE_URL: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    FRONTEND_URL: zod_1.z.string().default("http://localhost:3000"),
});
const envVars = envVarsZodSchema.safeParse(process.env);
if (!envVars.success) {
    console.error("❌ Invalid environment variables:", envVars.error.format());
    process.exit(1);
}
exports.env = envVars.data;
