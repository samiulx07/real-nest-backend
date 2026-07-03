import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createPropertySchema, updatePropertySchema } from "../validations/property.validation";
import * as propertyController from "../controllers/property.controller";

const router = Router();

router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);

router.post(
  "/",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  validateRequest(createPropertySchema),
  propertyController.createProperty
);

router.patch(
  "/:id",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  validateRequest(updatePropertySchema),
  propertyController.updateProperty
);

router.delete(
  "/:id",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  propertyController.deleteProperty
);

export default router;
