import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createFlatSchema, updateFlatSchema } from "../validations/flat.validation";
import * as flatController from "../controllers/flat.controller";

const router = Router();

router.get("/", flatController.getAllFlats);
router.get("/:id", flatController.getFlatById);

router.post(
  "/",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  validateRequest(createFlatSchema),
  flatController.createFlat
);

router.patch(
  "/:id",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  validateRequest(updateFlatSchema),
  flatController.updateFlat
);

router.delete(
  "/:id",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  flatController.deleteFlat
);

export default router;
