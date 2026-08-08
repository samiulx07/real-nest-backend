import prisma from "../config/prisma";
import { ApiError } from "../utils/ApiError";

export const createFlat = async (payload: any) => {
  // Check if target property exists
  const property = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new ApiError(404, "Target property not found");
  }

  const result = await prisma.flat.create({
    data: payload,
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          address: true,
          city: true,
          area: true,
        },
      },
    },
  });

  return result;
};

export const getAllFlats = async (filters: any, options: any) => {
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = options;
  const {
    propertyId,
    beds,
    baths,
    minPrice,
    maxPrice,
    status,
    isFeatured,
    search,
    hasGasLine,
    hasWaterSupply,
    furnishing,
    facing,
    city,
  } = filters;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const andConditions: any[] = [];

  if (propertyId) {
    andConditions.push({ propertyId });
  }

  if (beds) {
    andConditions.push({ beds: Number(beds) });
  }

  if (baths) {
    andConditions.push({ baths: Number(baths) });
  }

  if (status) {
    andConditions.push({ status: { equals: status } });
  }

  if (isFeatured !== undefined && isFeatured !== "") {
    andConditions.push({ isFeatured: isFeatured === "true" || isFeatured === true });
  }

  if (hasGasLine !== undefined && hasGasLine !== "") {
    andConditions.push({ hasGasLine: hasGasLine === "true" || hasGasLine === true });
  }

  if (hasWaterSupply !== undefined && hasWaterSupply !== "") {
    andConditions.push({ hasWaterSupply: hasWaterSupply === "true" || hasWaterSupply === true });
  }

  if (furnishing) {
    andConditions.push({ furnishing: { equals: furnishing, mode: "insensitive" } });
  }

  if (facing) {
    andConditions.push({ facing: { equals: facing, mode: "insensitive" } });
  }

  if (city) {
    andConditions.push({
      property: {
        city: { contains: city, mode: "insensitive" },
      },
    });
  }

  if (minPrice || maxPrice) {
    const priceCondition: any = {};
    if (minPrice) priceCondition.gte = Number(minPrice);
    if (maxPrice) priceCondition.lte = Number(maxPrice);
    andConditions.push({ price: priceCondition });
  }

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { flatNumber: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.flat.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          address: true,
          city: true,
          area: true,
        },
      },
    },
  });

  const total = await prisma.flat.count({
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

export const getFlatById = async (id: string) => {
  const result = await prisma.flat.findUnique({
    where: { id },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          address: true,
          city: true,
          area: true,
          latitude: true,
          longitude: true,
          amenities: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(404, "Flat not found");
  }

  return result;
};

export const updateFlat = async (id: string, payload: any) => {
  const flat = await prisma.flat.findUnique({
    where: { id },
  });

  if (!flat) {
    throw new ApiError(404, "Flat not found");
  }

  if (payload.propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: payload.propertyId },
    });
    if (!property) {
      throw new ApiError(404, "Target property not found");
    }
  }

  const result = await prisma.flat.update({
    where: { id },
    data: payload,
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          address: true,
          city: true,
          area: true,
        },
      },
    },
  });

  return result;
};

export const deleteFlat = async (id: string) => {
  const flat = await prisma.flat.findUnique({
    where: { id },
  });

  if (!flat) {
    throw new ApiError(404, "Flat not found");
  }

  const result = await prisma.flat.delete({
    where: { id },
  });

  return result;
};
