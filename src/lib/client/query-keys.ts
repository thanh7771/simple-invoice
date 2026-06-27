import type { InvoiceListFilters } from "@/lib/client/invoices-api";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  invoices: {
    all: ["invoices"] as const,
    list: (filters: InvoiceListFilters) =>
      ["invoices", "list", filters] as const,
  },
};
