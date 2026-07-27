import prisma from "../config/prisma";
import supabase from "../config/supabase";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Upload a file to Supabase Storage and create a Media record in the database.
 */
export const uploadMedia = async (
  file: Express.Multer.File,
  folder: string,
  userId: string
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const uniqueName = `${randomUUID()}${ext}`;
  const storagePath = `${folder}/${uniqueName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(env.SUPABASE_BUCKET_NAME)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error("❌ Supabase Storage Upload Error Details:", JSON.stringify(error, null, 2));
    throw new ApiError(500, `Failed to upload file: ${error.message}`);
  }

  // Build the public URL
  const { data: publicUrlData } = supabase.storage
    .from(env.SUPABASE_BUCKET_NAME)
    .getPublicUrl(storagePath);

  const fileUrl = publicUrlData.publicUrl;

  // Save record to the database
  const media = await prisma.media.create({
    data: {
      fileName: file.originalname,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      folder,
      uploadedBy: userId,
    },
  });

  return media;
};

/**
 * Get all media records with role-based filtering and pagination.
 * ADMIN/SUPER_ADMIN/STAFF: see all. CUSTOMER: see only their own.
 */
export const getAllMedia = async (
  filters: any,
  options: any,
  userId: string,
  userRole: string
) => {
  const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" } = options;
  const { folder, search } = filters;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const andConditions: any[] = [];

  // Role-based access: customers see only their own uploads
  if (userRole === "CUSTOMER") {
    andConditions.push({ uploadedBy: userId });
  }

  // Filter by folder
  if (folder) {
    andConditions.push({ folder: { equals: folder } });
  }

  // Search by file name
  if (search) {
    andConditions.push({
      fileName: { contains: search, mode: "insensitive" },
    });
  }

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.media.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.media.count({
    where: whereConditions,
  });

  const totalPages = Math.ceil(total / take);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
    data: result,
  };
};

/**
 * Get a single media record by ID.
 */
export const getMediaById = async (id: string) => {
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  if (!media) {
    throw new ApiError(404, "Media not found");
  }

  return media;
};

/**
 * Delete a single media record. Admins can delete any, users only their own.
 */
export const deleteMedia = async (id: string, userId: string, userRole: string) => {
  const media = await prisma.media.findUnique({
    where: { id },
  });

  if (!media) {
    throw new ApiError(404, "Media not found");
  }

  // Only allow owner or admins to delete
  if (userRole === "CUSTOMER" && media.uploadedBy !== userId) {
    throw new ApiError(403, "You are not allowed to delete this media");
  }

  // Extract storage path from URL
  const storagePath = extractStoragePath(media.fileUrl);

  if (storagePath) {
    const { error } = await supabase.storage
      .from(env.SUPABASE_BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      console.error("Failed to delete from storage:", error.message);
    }
  }

  await prisma.media.delete({
    where: { id },
  });

  return media;
};

/**
 * Bulk delete media records by IDs. Only ADMIN/SUPER_ADMIN/STAFF can use this.
 */
export const bulkDeleteMedia = async (ids: string[], userId: string, userRole: string) => {
  // Fetch all media records to delete
  const mediaList = await prisma.media.findMany({
    where: { id: { in: ids } },
  });

  if (mediaList.length === 0) {
    throw new ApiError(404, "No media found for the provided IDs");
  }

  // For CUSTOMER, filter only their own uploads
  const allowedMedia =
    userRole === "CUSTOMER"
      ? mediaList.filter((m) => m.uploadedBy === userId)
      : mediaList;

  if (allowedMedia.length === 0) {
    throw new ApiError(403, "You are not allowed to delete these media files");
  }

  // Delete from Supabase Storage
  const storagePaths = allowedMedia
    .map((m) => extractStoragePath(m.fileUrl))
    .filter((p): p is string => !!p);

  if (storagePaths.length > 0) {
    const { error } = await supabase.storage
      .from(env.SUPABASE_BUCKET_NAME)
      .remove(storagePaths);

    if (error) {
      console.error("Failed to bulk delete from storage:", error.message);
    }
  }

  // Delete from database
  const deleteResult = await prisma.media.deleteMany({
    where: { id: { in: allowedMedia.map((m) => m.id) } },
  });

  return { deletedCount: deleteResult.count };
};

/**
 * Extract the storage path from a Supabase public URL.
 * e.g., "https://xxx.supabase.co/storage/v1/object/public/media/properties/abc.jpg"
 *   → "properties/abc.jpg"
 */
function extractStoragePath(fileUrl: string): string | null {
  try {
    const bucketName = env.SUPABASE_BUCKET_NAME;
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const idx = fileUrl.indexOf(marker);
    if (idx === -1) return null;
    return fileUrl.substring(idx + marker.length);
  } catch {
    return null;
  }
}
