import { z } from "zod";

export const INVOICE_CURRENCIES = ["GBP", "USD", "EUR", "SGD", "VND"] as const;

export const INVOICE_CURRENCY_OPTIONS = INVOICE_CURRENCIES.map((value) => ({
  value,
  label: value,
}));

export const INVOICE_FORM_DEFAULTS = {
  currency: "GBP",
  quantity: 1,
  countryCode: "VN",
  itemUOM: "EA",
} as const;

export const createInvoiceSchema = z
  .object({
    invoiceNumber: z
      .string()
      .min(1, "Invoice number is required")
      .max(50, "Invoice number must be at most 50 characters"),
    invoiceReference: z.string().max(50).optional(),
    currency: z
      .string()
      .length(3, "Currency must be a 3-letter code (e.g. GBP)"),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be at most 500 characters"),
    customerFirstName: z.string().min(1, "Customer first name is required"),
    customerLastName: z.string().min(1, "Customer last name is required"),
    customerEmail: z.string().email("Invalid email address"),
    customerMobile: z.string().min(1, "Mobile number is required"),
    premise: z.string().min(1, "Address premise is required"),
    city: z.string().min(1, "City is required"),
    county: z.string().min(1, "County is required"),
    postcode: z.string().min(1, "Postcode is required"),
    countryCode: z
      .string()
      .length(2, "Country code must be 2 letters (e.g. VN)"),
    sortCode: z.string().min(1, "Sort code is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    accountName: z.string().min(1, "Account name is required"),
    itemName: z.string().min(1, "Item name is required"),
    itemDescription: z.string().min(1, "Item description is required"),
    quantity: z
      .number()
      .positive("Quantity must be greater than 0"),
    rate: z.number().positive("Rate must be greater than 0"),
    itemUOM: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.dueDate) >= new Date(data.invoiceDate),
    {
      message: "Due date must be on or after invoice date",
      path: ["dueDate"],
    }
  );

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

export function buildInvoicePayload(
  data: CreateInvoiceFormData
): import("@/lib/types/api").CreateInvoicePayload {
  return {
    invoices: [
      {
        bankAccount: {
          bankId: "",
          sortCode: data.sortCode,
          accountNumber: data.accountNumber,
          accountName: data.accountName,
        },
        customer: {
          firstName: data.customerFirstName,
          lastName: data.customerLastName,
          contact: {
            email: data.customerEmail,
            mobileNumber: data.customerMobile,
          },
          addresses: [
            {
              premise: data.premise,
              countryCode: data.countryCode,
              postcode: data.postcode,
              county: data.county,
              city: data.city,
              addressType: "BILLING",
            },
          ],
        },
        invoiceReference: data.invoiceReference ?? `#${data.invoiceNumber}`,
        invoiceNumber: data.invoiceNumber,
        currency: data.currency.toUpperCase(),
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        description: data.description,
        items: [
          {
            itemReference: `ref-${data.invoiceNumber}`,
            description: data.itemDescription,
            quantity: data.quantity,
            rate: data.rate,
            itemName: data.itemName,
            itemUOM: data.itemUOM ?? "EA",
          },
        ],
      },
    ],
  };
}
