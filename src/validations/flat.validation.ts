import { z } from "zod";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) {
    const d = new Date(arg);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}, z.date().optional());

export const createFlatSchema = z.object({
  body: z.object({
    propertyId: z.string({ message: "Property ID is required" }),
    title: z.string({ message: "Title is required" }),
    flatNumber: z.string({ message: "Flat number is required" }),
    floorNumber: z.number({ message: "Floor number is required" }),
    beds: z.number().default(1),
    baths: z.number().default(1),
    kitchens: z.boolean().default(true),
    balconies: z.number().default(1),
    size: z.number({ message: "Size in sqft is required" }),
    price: z.number({ message: "Price is required" }),
    status: z.enum(["AVAILABLE", "RESERVED", "BOOKED", "SOLD", "UNDER_RENOVATION"]).default("AVAILABLE"),
    completionDate: dateSchema,
    furnishing: z.string().optional(),
    facing: z.string().optional(),
    floorType: z.string().optional(),
    hasGasLine: z.boolean().default(false),
    hasWaterSupply: z.boolean().default(true),
    description: z.string().optional(),
    imageUrls: z.array(z.string()).default([]),
    amenities: z.array(z.string()).default([]),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(true),
  }),
});

export const updateFlatSchema = z.object({
  body: z.object({
    propertyId: z.string().optional(),
    title: z.string().optional(),
    flatNumber: z.string().optional(),
    floorNumber: z.number().optional(),
    beds: z.number().optional(),
    baths: z.number().optional(),
    kitchens: z.boolean().optional(),
    balconies: z.number().optional(),
    size: z.number().optional(),
    price: z.number().optional(),
    status: z.enum(["AVAILABLE", "RESERVED", "BOOKED", "SOLD", "UNDER_RENOVATION"]).optional(),
    completionDate: dateSchema,
    furnishing: z.string().optional(),
    facing: z.string().optional(),
    floorType: z.string().optional(),
    hasGasLine: z.boolean().optional(),
    hasWaterSupply: z.boolean().optional(),
    description: z.string().optional(),
    imageUrls: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
  }),
});
