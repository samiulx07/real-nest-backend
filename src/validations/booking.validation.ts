import { z } from "zod";

export const createBookingValidation = z.object({
  body: z.object({
    flatId: z.string({ message: "Flat ID is required" }),
    customerName: z.string({ message: "Customer name is required" }),
    customerEmail: z.string({ message: "Customer email is required" }).email("Invalid email format"),
    customerPhone: z.string({ message: "Customer phone is required" }),
    bookingAmount: z.number({ message: "Booking amount is required" }).positive("Amount must be positive"),
    notes: z.string().optional(),

    // Payment details
    paymentMethod: z.enum(["SSLCOMMERZ", "BANK_TRANSFER", "BKASH", "NAGAD", "CASH"]).default("BANK_TRANSFER"),
    senderAccount: z.string().optional(),
    bankTranId: z.string().optional(),
    receiptUrl: z.string().optional(),

    // Installment tracking
    installmentsPaidCount: z.number().int().min(1).default(1),
  }),
});

export const updateBookingStatusValidation = z.object({
  params: z.object({
    id: z.string({ message: "Booking ID is required" }),
  }),
  body: z.object({
    action: z.enum(["APPROVE", "REJECT"], { message: "Action must be APPROVE or REJECT" }),
    adminNotes: z.string().optional(),
  }),
});
