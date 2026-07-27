import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { asyncHandler } from "../utils/asyncHandler";

export const validateRequest = (schema: ZodSchema<any>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });
    
    // Assign validated data back to request to ensure type safety/defaults are applied
    // Only re-assign properties that were explicitly parsed in the schema
    if (result.body !== undefined) {
      Object.defineProperty(req, "body", { value: result.body, writable: true, configurable: true, enumerable: true });
    }
    if (result.query !== undefined) {
      Object.defineProperty(req, "query", { value: result.query, writable: true, configurable: true, enumerable: true });
    }
    if (result.params !== undefined) {
      Object.defineProperty(req, "params", { value: result.params, writable: true, configurable: true, enumerable: true });
    }
    if (result.cookies !== undefined) {
      Object.defineProperty(req, "cookies", { value: result.cookies, writable: true, configurable: true, enumerable: true });
    }

    next();
  });
