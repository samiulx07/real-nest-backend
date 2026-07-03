"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.getAllProperties = exports.createProperty = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const sendResponse_1 = require("../utils/sendResponse");
const propertyService = __importStar(require("../services/property.service"));
exports.createProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await propertyService.createProperty(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Property created successfully",
        data: result,
    });
});
exports.getAllProperties = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Properties retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.getPropertyById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const result = await propertyService.getPropertyById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Property retrieved successfully",
        data: result,
    });
});
exports.updateProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const result = await propertyService.updateProperty(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Property updated successfully",
        data: result,
    });
});
exports.deleteProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const result = await propertyService.deleteProperty(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Property deleted successfully",
        data: result,
    });
});
