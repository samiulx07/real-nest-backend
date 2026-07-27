import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";
import * as mediaService from "../services/media.service";

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "No file provided",
      data: null,
    });
  }

  const folder = (req.body.folder as string) || "general";
  const userId = req.user!.id;

  const result = await mediaService.uploadMedia(file, folder, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "File uploaded successfully",
    data: result,
  });
});

export const getAllMedia = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    folder: req.query.folder,
    search: req.query.search,
  };

  const options = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await mediaService.getAllMedia(filters, options, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Media retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getMediaById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await mediaService.getMediaById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Media retrieved successfully",
    data: result,
  });
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await mediaService.deleteMedia(id, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Media deleted successfully",
    data: result,
  });
});

export const bulkDeleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Please provide an array of media IDs to delete",
      data: null,
    });
  }

  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await mediaService.bulkDeleteMedia(ids, userId, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Successfully deleted ${result.deletedCount} media file(s)`,
    data: result,
  });
});
