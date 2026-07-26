import { z } from "zod";

export const createFlatSchema = z.object({
  body: z.object({
    propertyId: z.string({ message: "Property ID is required" }),
    title: z.string({ message: "Title is required" }),
    flatNumber: z.string({ message: "Flat number is required" }),
    floorNumber: z.number({ message: "Floor number is required" }),
    beds: z.number().default(1),
    baths: z.number().default(1),
    kitchens: z.number().default(1),
    balconies: z.number().default(1),
    size: z.number({ message: "Size in sqft is required" }),
    price: z.number({ message: "Price is required" }),
    status: z.enum(["AVAILABLE", "BOOKED", "SOLD"]).default("AVAILABLE"),
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
    kitchens: z.number().optional(),
    balconies: z.number().optional(),
    size: z.number().optional(),
    price: z.number().optional(),
    status: z.enum(["AVAILABLE", "BOOKED", "SOLD"]).optional(),
    description: z.string().optional(),
    imageUrls: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
  }),
});
