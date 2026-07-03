import prisma from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slug";

export const createProperty = async (payload: any) => {
  const slugBase = payload.slug ? slugify(payload.slug) : slugify(payload.title);

  // Check if slug is unique
  let count = 0;
  let uniqueSlug = slugBase;
  while (true) {
    const existing = await prisma.property.findUnique({
      where: { slug: uniqueSlug },
    });
    if (!existing) break;
    count++;
    uniqueSlug = `${slugBase}-${count}`;
  }

  payload.slug = uniqueSlug;

  const result = await prisma.property.create({
    data: payload,
  });

  return result;
};

export const getAllProperties = async (filters: any, options: any) => {
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = options;
  const { search, city, area, status, isFeatured } = filters;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const andConditions: any[] = [];

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

  const result = await prisma.property.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.property.count({
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

export const getPropertyById = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(404, "Property not found");
  }

  return result;
};

export const updateProperty = async (id: string, payload: any) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Regenerate/uniquify slug if title or slug is being updated
  if (payload.title && !payload.slug) {
    const slugBase = slugify(payload.title);
    let count = 0;
    let uniqueSlug = slugBase;
    while (true) {
      const existing = await prisma.property.findUnique({
        where: { slug: uniqueSlug },
      });
      if (!existing || existing.id === id) break;
      count++;
      uniqueSlug = `${slugBase}-${count}`;
    }
    payload.slug = uniqueSlug;
  } else if (payload.slug) {
    const slugBase = slugify(payload.slug);
    let count = 0;
    let uniqueSlug = slugBase;
    while (true) {
      const existing = await prisma.property.findUnique({
        where: { slug: uniqueSlug },
      });
      if (!existing || existing.id === id) break;
      count++;
      uniqueSlug = `${slugBase}-${count}`;
    }
    payload.slug = uniqueSlug;
  }

  const result = await prisma.property.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const deleteProperty = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const result = await prisma.property.delete({
    where: { id },
  });

  return result;
};
