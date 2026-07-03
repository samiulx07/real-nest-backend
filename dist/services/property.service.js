"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.getAllProperties = exports.createProperty = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const slug_1 = require("../utils/slug");
const createProperty = async (payload) => {
    const slugBase = payload.slug ? (0, slug_1.slugify)(payload.slug) : (0, slug_1.slugify)(payload.title);
    // Check if slug is unique
    let count = 0;
    let uniqueSlug = slugBase;
    while (true) {
        const existing = await prisma_1.default.property.findUnique({
            where: { slug: uniqueSlug },
        });
        if (!existing)
            break;
        count++;
        uniqueSlug = `${slugBase}-${count}`;
    }
    payload.slug = uniqueSlug;
    const result = await prisma_1.default.property.create({
        data: payload,
    });
    return result;
};
exports.createProperty = createProperty;
const getAllProperties = async (filters, options) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = options;
    const { search, city, area, status, isFeatured } = filters;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const andConditions = [];
    // Search filter (searches title and address)
    if (search) {
        andConditions.push({
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
            ],
        });
    }
    // Exact matches
    if (city) {
        andConditions.push({ city: { equals: city, mode: "insensitive" } });
    }
    if (area) {
        andConditions.push({ area: { equals: area, mode: "insensitive" } });
    }
    if (status) {
        andConditions.push({ status: { equals: status, mode: "insensitive" } });
    }
    if (isFeatured !== undefined) {
        andConditions.push({ isFeatured: isFeatured === "true" || isFeatured === true });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.property.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma_1.default.property.count({
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
exports.getAllProperties = getAllProperties;
const getPropertyById = async (id) => {
    const result = await prisma_1.default.property.findUnique({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.ApiError(404, "Property not found");
    }
    return result;
};
exports.getPropertyById = getPropertyById;
const updateProperty = async (id, payload) => {
    const property = await prisma_1.default.property.findUnique({
        where: { id },
    });
    if (!property) {
        throw new ApiError_1.ApiError(404, "Property not found");
    }
    // Regenerate/uniquify slug if title or slug is being updated
    if (payload.title && !payload.slug) {
        const slugBase = (0, slug_1.slugify)(payload.title);
        let count = 0;
        let uniqueSlug = slugBase;
        while (true) {
            const existing = await prisma_1.default.property.findUnique({
                where: { slug: uniqueSlug },
            });
            if (!existing || existing.id === id)
                break;
            count++;
            uniqueSlug = `${slugBase}-${count}`;
        }
        payload.slug = uniqueSlug;
    }
    else if (payload.slug) {
        const slugBase = (0, slug_1.slugify)(payload.slug);
        let count = 0;
        let uniqueSlug = slugBase;
        while (true) {
            const existing = await prisma_1.default.property.findUnique({
                where: { slug: uniqueSlug },
            });
            if (!existing || existing.id === id)
                break;
            count++;
            uniqueSlug = `${slugBase}-${count}`;
        }
        payload.slug = uniqueSlug;
    }
    const result = await prisma_1.default.property.update({
        where: { id },
        data: payload,
    });
    return result;
};
exports.updateProperty = updateProperty;
const deleteProperty = async (id) => {
    const property = await prisma_1.default.property.findUnique({
        where: { id },
    });
    if (!property) {
        throw new ApiError_1.ApiError(404, "Property not found");
    }
    const result = await prisma_1.default.property.delete({
        where: { id },
    });
    return result;
};
exports.deleteProperty = deleteProperty;
