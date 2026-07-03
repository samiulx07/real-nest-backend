import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";
import * as propertyService from "../services/property.service";

export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  const result = await propertyService.createProperty(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Property created successfully",
    data: result,
  });
});

export const getAllProperties = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    search: req.query.search,
    city: req.query.city,
    area: req.query.area,
    status: req.query.status,
    isFeatured: req.query.isFeatured,
  };

  const options = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await propertyService.getAllProperties(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await propertyService.getPropertyById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property retrieved successfully",
    data: result,
  });
});

export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await propertyService.updateProperty(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property updated successfully",
    data: result,
  });
});

export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await propertyService.deleteProperty(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property deleted successfully",
    data: result,
  });
});
