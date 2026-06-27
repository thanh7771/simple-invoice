import { getApiConfig } from "./config";
import { readApiError } from "./errors";
import type {
  CreateInvoicePayload,
  InvoiceListParams,
  InvoiceListResponse,
  RawInvoiceListResponse,
} from "@/lib/types/api";

function buildAuthHeaders(
  accessToken: string,
  orgToken: string
): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    "org-token": orgToken,
    "Content-Type": "application/json",
  };
}

export async function fetchInvoices(
  accessToken: string,
  orgToken: string,
  params: InvoiceListParams = {}
): Promise<InvoiceListResponse> {
  const { apiBaseUrl } = getApiConfig();

  const searchParams = new URLSearchParams();
  searchParams.set("sortBy", params.sortBy ?? "CREATED_DATE");
  searchParams.set("ordering", params.ordering ?? "DESCENDING");
  searchParams.set("pageNum", String(params.pageNum ?? 1));
  searchParams.set("pageSize", String(params.pageSize ?? 10));

  if (params.fromDate) searchParams.set("fromDate", params.fromDate);
  if (params.toDate) searchParams.set("toDate", params.toDate);
  if (params.status) searchParams.set("status", params.status);
  if (params.keyword) searchParams.set("keyword", params.keyword);

  const response = await fetch(
    `${apiBaseUrl}/invoice-service/1.0.0/invoices?${searchParams}`,
    { headers: buildAuthHeaders(accessToken, orgToken) }
  );

  if (!response.ok) {
    throw await readApiError(response, "Failed to fetch invoices");
  }

  const result: RawInvoiceListResponse = await response.json();

  return {
    invoices: result.data ?? [],
    totalRecords: result.paging?.totalRecords ?? 0,
    pageNum: result.paging?.pageNumber ?? 1,
    pageSize: result.paging?.pageSize ?? 10,
  };
}

export async function createInvoice(
  accessToken: string,
  orgToken: string,
  payload: CreateInvoicePayload
): Promise<unknown> {
  const { apiBaseUrl } = getApiConfig();

  const response = await fetch(
    `${apiBaseUrl}/invoice-service/1.0.0/invoices`,
    {
      method: "POST",
      headers: {
        ...buildAuthHeaders(accessToken, orgToken),
        "Operation-Mode": "SYNC",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw await readApiError(response, "Failed to create invoice");
  }

  return response.json();
}
