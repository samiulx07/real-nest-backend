import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger";
import routes from "./routes";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app: Application = express();

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
        connectSrc: ["'self'"],
      },
    },
  })
);
// Configure allowed CORS origins
const allowedOrigins = env.FRONTEND_URL
  ? env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) => {
        return allowed === origin || (env.NODE_ENV === "development" && origin.startsWith("http://localhost:"));
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/v1", routes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Real Nest API!");
});

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
