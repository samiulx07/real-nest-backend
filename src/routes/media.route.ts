import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/auth.middleware";
import * as mediaController from "../controllers/media.controller";

const router = Router();

// Multer config — store files in memory (buffer) for direct upload to Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed"));
    }
  },
});

// Upload — any authenticated user can upload
router.post(
  "/upload",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"),
  upload.single("file"),
  mediaController.uploadMedia
);

// List — any authenticated user (role-filtered in service)
router.get(
  "/",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"),
  mediaController.getAllMedia
);

// Get single media
router.get(
  "/:id",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"),
  mediaController.getMediaById
);

// Delete single — any authenticated user (ownership checked in service)
router.delete(
  "/:id",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"),
  mediaController.deleteMedia
);

// Bulk delete — admin only
router.post(
  "/bulk-delete",
  authMiddleware("SUPER_ADMIN", "ADMIN", "STAFF"),
  mediaController.bulkDeleteMedia
);

export default router;
