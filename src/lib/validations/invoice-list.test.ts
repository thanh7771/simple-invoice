import { describe, it, expect } from "vitest";
import {
  buildInvoiceListSearchParams,
  getInvoiceListFieldErrors,
  isValidCalendarDate,
  parseInvoiceListQuery,
} from "@/lib/validations/invoice-list";

describe("isValidCalendarDate", () => {
  it("accepts real dates", () => {
    expect(isValidCalendarDate("2024-02-29")).toBe(true);
    expect(isValidCalendarDate("2024-12-31")).toBe(true);
  });

  it("rejects impossible dates", () => {
    expect(isValidCalendarDate("2024-02-30")).toBe(false);
    expect(isValidCalendarDate("2024-13-01")).toBe(false);
  });
});

describe("parseInvoiceListQuery", () => {
  it("applies defaults for missing params", () => {
    const result = parseInvoiceListQuery(new URLSearchParams());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortBy).toBe("CREATED_DATE");
      expect(result.data.ordering).toBe("DESCENDING");
      expect(result.data.pageNum).toBe(1);
      expect(result.data.pageSize).toBe(10);
    }
  });

  it("accepts valid query params", () => {
    const result = parseInvoiceListQuery(
      new URLSearchParams({
        sortBy: "INVOICE_DATE",
        ordering: "ASCENDING",
        pageNum: "2",
        pageSize: "20",
        status: "Paid",
        keyword: "INV123",
        fromDate: "2024-01-01",
        toDate: "2024-12-31",
      })
    );

    expect(result.success).toBe(true);
  });

  it("rejects non-numeric pageNum", () => {
    const result = parseInvoiceListQuery(
      new URLSearchParams({ pageNum: "abc" })
    );

    expect(result.success).toBe(false);
  });

  it("rejects pageSize above max", () => {
    const result = parseInvoiceListQuery(
      new URLSearchParams({ pageSize: "999999" })
    );

    expect(result.success).toBe(false);
  });

  it("rejects invalid sortBy", () => {
    const result = parseInvoiceListQuery(
      new URLSearchParams({ sortBy: "INVALID" })
    );

    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = parseInvoiceListQuery(
      new URLSearchParams({ status: "Unknown" })
    );

    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = parseInvoiceListQuery(
      new URLSearchParams({ fromDate: "01-01-2024" })
    );

    expect(result.success).toBe(false);
  });

  it("rejects impossible calendar dates", () => {
    const result = parseInvoiceListQuery(
      new URLSearchParams({ fromDate: "2024-02-30" })
    );

    expect(result.success).toBe(false);
  });

  it("accepts equal fromDate and toDate", () => {
    const result = parseInvoiceListQuery(
      new URLSearchParams({
        fromDate: "2024-06-01",
        toDate: "2024-06-01",
      })
    );

    expect(result.success).toBe(true);
  });

  it("rejects toDate before fromDate", () => {
    const params = buildInvoiceListSearchParams({
      sortBy: "CREATED_DATE",
      ordering: "DESCENDING",
      pageNum: 1,
      pageSize: 10,
      fromDate: "2026-06-30",
      toDate: "2026-06-24",
    });

    const errors = getInvoiceListFieldErrors(params);

    expect(parseInvoiceListQuery(params).success).toBe(false);
    expect(errors.toDate?.[0]).toBe("To Date must be on or after From Date");
  });
});
