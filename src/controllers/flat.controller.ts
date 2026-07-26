import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";
import * as flatService from "../services/flat.service";

export const createFlat = asyncHandler(async (req: Request, res: Response) => {
  const result = await flatService.createFlat(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Flat created successfully",
    data: result,
  });
});

export const getAllFlats = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    propertyId: req.query.propertyId,
    beds: req.query.beds,
    baths: req.query.baths,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    status: req.query.status,
    isFeatured: req.query.isFeatured,
    search: req.query.search,
  };

  const options = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await flatService.getAllFlats(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Flats retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getFlatById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await flatService.getFlatById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Flat retrieved successfully",
    data: result,
  });
});

export const updateFlat = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await flatService.updateFlat(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Flat updated successfully",
    data: result,
  });
});

export const deleteFlat = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await flatService.deleteFlat(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Flat deleted successfully",
    data: result,
  });
});
