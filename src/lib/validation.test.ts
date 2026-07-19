import { describe, expect, it } from "vitest";
import { invoiceSchema, notificationSchema, projectSchema, requestSchema } from "@/lib/validation";

describe("ClientFlow validation", () => {
  it("accepts a complete project", () => {
    const result = projectSchema.safeParse({ name: "Website launch", summary: "A complete responsive website delivery.", dueDate: "2026-09-01", budget: "4800" });
    expect(result.success).toBe(true);
  });

  it("rejects an unclear request", () => {
    const result = requestSchema.safeParse({ title: "Hi", detail: "Change it" });
    expect(result.success).toBe(false);
  });

  it("rejects a negative invoice", () => {
    const result = invoiceSchema.safeParse({ amount: -1, dueDate: "2026-09-01" });
    expect(result.success).toBe(false);
  });

  it("accepts a supported notification event", () => {
    const result = notificationSchema.safeParse({ event: "invoice_paid", recipient: "client@example.com", subject: "Payment recorded", message: "Invoice CF-1012 is now paid." });
    expect(result.success).toBe(true);
  });
});
