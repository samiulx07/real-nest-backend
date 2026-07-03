import { z } from "zod";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) {
    const d = new Date(arg);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}, z.date().optional());

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }),
    slug: z.string().optional(),
    description: z.string().optional(),
    address: z.string({ message: "Address is required" }),
    area: z.string({ message: "Area is required" }),
    city: z.string().default("Dhaka"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    floorLabel: z.string({ message: "Floor label is required" }),
    totalFloors: z.number({ message: "Total floors is required" }),
    totalUnits: z.number({ message: "Total units is required" }),
    unitsPerFloor: z.number().optional(),
    startingPrice: z.number().optional(),
    handoverDate: dateSchema,
    landArea: z.string().optional(),
    facing: z.string().optional(),
    roadSize: z.string().optional(),
    parkingAvailable: z.boolean().default(false),
    liftAvailable: z.boolean().default(false),
    generatorBackup: z.boolean().default(false),
    securityAvailable: z.boolean().default(false),
    imageUrls: z.array(z.string()).default([]),
    amenities: z.array(z.string()).default([]),
    status: z.string().optional(),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(true),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    area: z.string().optional(),
    city: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    floorLabel: z.string().optional(),
    totalFloors: z.number().optional(),
    totalUnits: z.number().optional(),
    unitsPerFloor: z.number().optional(),
    startingPrice: z.number().optional(),
    handoverDate: dateSchema,
    landArea: z.string().optional(),
    facing: z.string().optional(),
    roadSize: z.string().optional(),
    parkingAvailable: z.boolean().optional(),
    liftAvailable: z.boolean().optional(),
    generatorBackup: z.boolean().optional(),
    securityAvailable: z.boolean().optional(),
    imageUrls: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    status: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
  }),
});
