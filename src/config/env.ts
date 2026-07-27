import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envVarsZodSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_BUCKET_NAME: z.string().default("media"),
  RESEND_API_KEY: z.string().default(""),
  RESEND_FROM_EMAIL: z.string().default("Real Nest <onboarding@resend.dev>"),
});

const envVars = envVarsZodSchema.safeParse(process.env);

if (!envVars.success) {
  console.error("❌ Invalid environment variables:", envVars.error.format());
  process.exit(1);
}

export const env = envVars.data;
