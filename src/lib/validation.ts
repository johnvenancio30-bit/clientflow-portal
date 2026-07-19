import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(3, "Use at least 3 characters").max(80),
  summary: z.string().trim().min(8, "Add a short project summary").max(240),
  dueDate: z.string().date(),
  budget: z.coerce.number().positive().max(1_000_000),
});

export const requestSchema = z.object({
  title: z.string().trim().min(3, "Use at least 3 characters").max(100),
  detail: z.string().trim().min(8, "Add a little more detail").max(500),
});

export const invoiceSchema = z.object({
  amount: z.coerce.number().positive().max(1_000_000),
  dueDate: z.string().date(),
});

export const notificationSchema = z.object({
  event: z.enum(["request_created", "milestone_completed", "invoice_paid"]),
  recipient: z.string().email(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(8).max(1000),
});

export type NotificationInput = z.infer<typeof notificationSchema>;
