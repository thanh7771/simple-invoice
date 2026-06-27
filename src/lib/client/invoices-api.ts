import { BFF_ENDPOINTS } from "@/lib/api/endpoints";
import { bffFetch } from "@/lib/client/bff-client";
import type { CreateInvoiceFormData } from "@/lib/validations/invoice";
import type { InvoiceListResponse } from "@/lib/types/api";
import { buildInvoiceListSearchParams } from "@/lib/validations/invoice-list";

export interface InvoiceListFilters {
  sortBy: string;
  ordering: string;
  pageNum: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export function fetchInvoiceList(filters: InvoiceListFilters) {
  const params = buildInvoiceListSearchParams(filters);

  return bffFetch<InvoiceListResponse>(
    `${BFF_ENDPOINTS.invoices.root}?${params}`
  );
}

export interface CreateInvoiceResponse {
  message: string;
  data?: unknown;
}

export function createInvoiceRequest(data: CreateInvoiceFormData) {
  return bffFetch<CreateInvoiceResponse>(BFF_ENDPOINTS.invoices.root, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
