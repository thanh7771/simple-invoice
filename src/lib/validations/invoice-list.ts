import { z } from "zod";

export const INVOICE_SORT_BY = [
  "CREATED_DATE",
  "INVOICE_DATE",
  "DUE_DATE",
] as const;

export const INVOICE_ORDERING = ["ASCENDING", "DESCENDING"] as const;

export const INVOICE_STATUS = [
  "Due",
  "Overdue",
  "Paid",
  "Cancelled",
  "Rejected",
] as const;

export const INVOICE_PAGE_SIZES = [5, 10, 20] as const;

const SORT_BY_LABELS: Record<(typeof INVOICE_SORT_BY)[number], string> = {
  CREATED_DATE: "Created Date",
  INVOICE_DATE: "Invoice Date",
  DUE_DATE: "Due Date",
};

const ORDERING_LABELS: Record<(typeof INVOICE_ORDERING)[number], string> = {
  DESCENDING: "Newest First",
  ASCENDING: "Oldest First",
};

export const INVOICE_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...INVOICE_STATUS.map((status) => ({ value: status, label: status })),
];

export const INVOICE_SORT_BY_OPTIONS = INVOICE_SORT_BY.map((value) => ({
  value,
  label: SORT_BY_LABELS[value],
}));

export const INVOICE_ORDERING_OPTIONS = INVOICE_ORDERING.map((value) => ({
  value,
  label: ORDERING_LABELS[value],
}));

export const INVOICE_PAGE_SIZE_OPTIONS = INVOICE_PAGE_SIZES.map((size) => ({
  value: String(size),
  label: `${size} per page`,
}));

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidCalendarDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const dateParam = z
  .string()
  .regex(DATE_PATTERN, "Date must be YYYY-MM-dd")
  .refine(isValidCalendarDate, "Date is invalid");

export const invoiceListQuerySchema = z
  .object({
    sortBy: z.enum(INVOICE_SORT_BY).default("CREATED_DATE"),
    ordering: z.enum(INVOICE_ORDERING).default("DESCENDING"),
    pageNum: z.coerce.number().int().min(1).max(9999).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    fromDate: dateParam.optional(),
    toDate: dateParam.optional(),
    status: z.enum(INVOICE_STATUS).optional(),
    keyword: z.string().trim().min(1).max(100).optional(),
  })
  .refine(
    (data) =>
      !data.fromDate || !data.toDate || data.toDate >= data.fromDate,
    {
      message: "To Date must be on or after From Date",
      path: ["toDate"],
    }
  );

export type InvoiceListQuery = z.infer<typeof invoiceListQuerySchema>;

function optionalParam(value: string | null): string | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }
  return value;
}

export function parseInvoiceListQuery(searchParams: URLSearchParams) {
  return invoiceListQuerySchema.safeParse({
    sortBy: optionalParam(searchParams.get("sortBy")),
    ordering: optionalParam(searchParams.get("ordering")),
    pageNum: optionalParam(searchParams.get("pageNum")),
    pageSize: optionalParam(searchParams.get("pageSize")),
    fromDate: optionalParam(searchParams.get("fromDate")),
    toDate: optionalParam(searchParams.get("toDate")),
    status: optionalParam(searchParams.get("status")),
    keyword: optionalParam(searchParams.get("keyword")),
  });
}

export function buildInvoiceListSearchParams(input: {
  sortBy: string;
  ordering: string;
  pageNum: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const params = new URLSearchParams({
    sortBy: input.sortBy,
    ordering: input.ordering,
    pageNum: String(input.pageNum),
    pageSize: String(input.pageSize),
  });

  if (input.keyword) params.set("keyword", input.keyword);
  if (input.status) params.set("status", input.status);
  if (input.fromDate) params.set("fromDate", input.fromDate);
  if (input.toDate) params.set("toDate", input.toDate);

  return params;
}

export function getInvoiceListFieldErrors(searchParams: URLSearchParams) {
  const result = parseInvoiceListQuery(searchParams);
  if (result.success) {
    return {};
  }

  return result.error.flatten().fieldErrors;
}
