"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
const dateSchema = zod_1.z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
        const d = new Date(arg);
        return isNaN(d.getTime()) ? undefined : d;
    }
    return undefined;
}, zod_1.z.date().optional());
exports.createPropertySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ message: "Title is required" }),
        slug: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        address: zod_1.z.string({ message: "Address is required" }),
        area: zod_1.z.string({ message: "Area is required" }),
        city: zod_1.z.string().default("Dhaka"),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        floorLabel: zod_1.z.string({ message: "Floor label is required" }),
        totalFloors: zod_1.z.number({ message: "Total floors is required" }),
        totalUnits: zod_1.z.number({ message: "Total units is required" }),
        unitsPerFloor: zod_1.z.number().optional(),
        startingPrice: zod_1.z.number().optional(),
        handoverDate: dateSchema,
        landArea: zod_1.z.string().optional(),
        facing: zod_1.z.string().optional(),
        roadSize: zod_1.z.string().optional(),
        parkingAvailable: zod_1.z.boolean().default(false),
        liftAvailable: zod_1.z.boolean().default(false),
        generatorBackup: zod_1.z.boolean().default(false),
        securityAvailable: zod_1.z.boolean().default(false),
        imageUrls: zod_1.z.array(zod_1.z.string()).default([]),
        amenities: zod_1.z.array(zod_1.z.string()).default([]),
        status: zod_1.z.string().optional(),
        isFeatured: zod_1.z.boolean().default(false),
        isPublished: zod_1.z.boolean().default(true),
    }),
});
exports.updatePropertySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        slug: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        area: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        floorLabel: zod_1.z.string().optional(),
        totalFloors: zod_1.z.number().optional(),
        totalUnits: zod_1.z.number().optional(),
        unitsPerFloor: zod_1.z.number().optional(),
        startingPrice: zod_1.z.number().optional(),
        handoverDate: dateSchema,
        landArea: zod_1.z.string().optional(),
        facing: zod_1.z.string().optional(),
        roadSize: zod_1.z.string().optional(),
        parkingAvailable: zod_1.z.boolean().optional(),
        liftAvailable: zod_1.z.boolean().optional(),
        generatorBackup: zod_1.z.boolean().optional(),
        securityAvailable: zod_1.z.boolean().optional(),
        imageUrls: zod_1.z.array(zod_1.z.string()).optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
        status: zod_1.z.string().optional(),
        isFeatured: zod_1.z.boolean().optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
