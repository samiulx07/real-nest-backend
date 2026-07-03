// Swagger API Docs integration
import app from "./app";
import { env } from "./config/env";
import prisma from "./config/prisma";

let server: any;

async function bootstrap() {
  try {
    // Attempt database connection
    await prisma.$connect();
    console.log("🛢️Connected to the database successfully");

    server = app.listen(env.PORT, () => {
      console.log(`🚀 Server is running on port ${env.PORT}`);
    });
  } catch (err) {
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
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions gracefully
process.on("uncaughtException", (err) => {
  console.log("😈 uncaughtException is detected, shutting down...");
  process.exit(1);
});
