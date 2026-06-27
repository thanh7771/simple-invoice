import { describe, it, expect } from "vitest";
import {
  createInvoiceSchema,
  buildInvoicePayload,
} from "@/lib/validations/invoice";

const validInvoice = {
  invoiceNumber: "INV123456701",
  invoiceReference: "#123456",
  currency: "GBP",
  invoiceDate: "2021-05-27",
  dueDate: "2021-06-04",
  description: "Test invoice",
  customerFirstName: "Nguyen",
  customerLastName: "Dung",
  customerEmail: "test@101digital.io",
  customerMobile: "+6597594971",
  premise: "CT11",
  city: "hanoi",
  county: "hoangmai",
  postcode: "1000",
  countryCode: "VN",
  sortCode: "09-01-01",
  accountNumber: "12345678",
  accountName: "John Terry",
  itemName: "Honda Motor",
  itemDescription: "Honda RC150",
  quantity: 1,
  rate: 1000,
  itemUOM: "KG",
};

describe("createInvoiceSchema", () => {
  it("accepts valid invoice data", () => {
    const result = createInvoiceSchema.safeParse(validInvoice);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      customerEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects due date before invoice date", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      invoiceDate: "2021-06-04",
      dueDate: "2021-05-27",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Due date must be on or after invoice date"
      );
    }
  });

  it("rejects zero quantity", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      quantity: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid currency code", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInvoice,
      currency: "INVALID",
    });
    expect(result.success).toBe(false);
  });
});

describe("buildInvoicePayload", () => {
  it("builds correct API payload with single line item", () => {
    const parsed = createInvoiceSchema.parse(validInvoice);
    const payload = buildInvoicePayload(parsed);

    expect(payload.invoices).toHaveLength(1);
    expect(payload.invoices[0].items).toHaveLength(1);
    expect(payload.invoices[0].invoiceNumber).toBe("INV123456701");
    expect(payload.invoices[0].items[0].itemName).toBe("Honda Motor");
    expect(payload.invoices[0].items[0].quantity).toBe(1);
    expect(payload.invoices[0].items[0].rate).toBe(1000);
    expect(payload.invoices[0].customer.addresses[0].addressType).toBe(
      "BILLING"
    );
  });

  it("uppercases currency code", () => {
    const parsed = createInvoiceSchema.parse({
      ...validInvoice,
      currency: "gbp",
    });
    const payload = buildInvoicePayload(parsed);
    expect(payload.invoices[0].currency).toBe("GBP");
  });
});
