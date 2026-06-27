"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { APP_ROUTES } from "@/lib/api/endpoints";
import { getErrorMessage } from "@/lib/client/get-error-message";
import { useInvoiceList } from "@/hooks/use-invoices";
import {
  buildInvoiceListSearchParams,
  getInvoiceListFieldErrors,
  INVOICE_ORDERING_OPTIONS,
  INVOICE_PAGE_SIZE_OPTIONS,
  INVOICE_SORT_BY_OPTIONS,
  INVOICE_STATUS_FILTER_OPTIONS,
  parseInvoiceListQuery,
} from "@/lib/validations/invoice-list";
import type { Invoice } from "@/lib/types/api";

export function InvoiceList() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("CREATED_DATE");
  const [ordering, setOrdering] = useState("DESCENDING");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [errorDismissed, setErrorDismissed] = useState(false);

  const filters = useMemo(
    () => ({
      sortBy,
      ordering,
      pageNum,
      pageSize,
      keyword: keyword || undefined,
      status: status || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [keyword, status, fromDate, toDate, sortBy, ordering, pageNum, pageSize]
  );

  const validation = useMemo(() => {
    const params = buildInvoiceListSearchParams(filters);
    const parsed = parseInvoiceListQuery(params);
    const fieldErrors = getInvoiceListFieldErrors(params);

    return {
      isValid: parsed.success,
      dateErrors: {
        fromDate: fieldErrors.fromDate?.[0],
        toDate: fieldErrors.toDate?.[0],
      },
    };
  }, [filters]);

  const {
    data,
    error,
    isPending,
    isFetching,
    isError,
    isPlaceholderData,
  } = useInvoiceList(filters, { enabled: validation.isValid });

  const invoices = data?.invoices ?? [];
  const totalRecords = data?.totalRecords ?? 0;
  const isInitialLoad = validation.isValid && isPending;
  const isRefreshing = validation.isValid && isFetching && isPlaceholderData;
  const listError =
    isError && !errorDismissed
      ? getErrorMessage(error, "Failed to load invoices")
      : "";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setErrorDismissed(false);
    setKeyword(searchInput);
    setPageNum(1);
  }

  function handleFilterReset() {
    setSearchInput("");
    setKeyword("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setSortBy("CREATED_DATE");
    setOrdering("DESCENDING");
    setPageNum(1);
    setPageSize(10);
  }

  function updateFilter(updater: () => void) {
    setErrorDismissed(false);
    updater();
    setPageNum(1);
  }

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalRecords} invoice{totalRecords !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link href={APP_ROUTES.createInvoice}>
          <Button>+ Create Invoice</Button>
        </Link>
      </div>

      {listError && (
        <Alert
          type="error"
          message={listError}
          onDismiss={() => setErrorDismissed(true)}
        />
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <Input
                label="Search by Invoice Number"
                placeholder="e.g. INV123456701"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Select
              label="Status"
              options={INVOICE_STATUS_FILTER_OPTIONS}
              value={status}
              onChange={(e) =>
                updateFilter(() => setStatus(e.target.value))
              }
            />
            <Select
              label="Sort By"
              options={INVOICE_SORT_BY_OPTIONS}
              value={sortBy}
              onChange={(e) =>
                updateFilter(() => setSortBy(e.target.value))
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="From Date"
              type="date"
              value={fromDate}
              error={validation.dateErrors.fromDate}
              onChange={(e) =>
                updateFilter(() => setFromDate(e.target.value))
              }
            />
            <Input
              label="To Date"
              type="date"
              value={toDate}
              error={validation.dateErrors.toDate}
              onChange={(e) =>
                updateFilter(() => setToDate(e.target.value))
              }
            />
            <Select
              label="Order"
              options={INVOICE_ORDERING_OPTIONS}
              value={ordering}
              onChange={(e) =>
                updateFilter(() => setOrdering(e.target.value))
              }
            />
            <Select
              label="Page Size"
              options={INVOICE_PAGE_SIZE_OPTIONS}
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Search</Button>
            <Button type="button" variant="secondary" onClick={handleFilterReset}>
              Reset Filters
            </Button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isInitialLoad ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-lg font-medium">No invoices found</p>
            <p className="mt-1 text-sm">Try adjusting your filters or create a new invoice.</p>
          </div>
        ) : (
          <div className={isRefreshing ? "opacity-60 transition-opacity" : undefined}>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {invoices.map((invoice) => (
                    <tr key={invoice.invoiceId ?? invoice.invoiceNumber} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {getCustomerName(invoice)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {invoice.invoiceDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {invoice.dueDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {invoice.totalAmount != null
                          ? `${invoice.currency} ${invoice.totalAmount.toFixed(2)}`
                          : invoice.currency}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={getInvoiceStatus(invoice)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-200 md:hidden">
              {invoices.map((invoice) => (
                <div key={invoice.invoiceId ?? invoice.invoiceNumber} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-blue-600">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-500">
                        {getCustomerName(invoice)}
                      </p>
                    </div>
                    <StatusBadge status={getInvoiceStatus(invoice)} />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
                    <span>Date: {invoice.invoiceDate}</span>
                    <span>Due: {invoice.dueDate}</span>
                    <span className="col-span-2 font-medium text-gray-900">
                      {invoice.totalAmount != null
                        ? `${invoice.currency} ${invoice.totalAmount.toFixed(2)}`
                        : invoice.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <p className="text-sm text-gray-500">
              Page {pageNum} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={pageNum <= 1}
                onClick={() => setPageNum((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={pageNum >= totalPages}
                onClick={() => setPageNum((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getCustomerName(invoice: Invoice): string {
  if (!invoice.customer) return "—";
  if (invoice.customer.name) return invoice.customer.name;
  const parts = [invoice.customer.firstName, invoice.customer.lastName].filter(
    Boolean
  );
  return parts.length > 0 ? parts.join(" ") : "—";
}

function getInvoiceStatus(invoice: Invoice): string | undefined {
  if (!invoice.status) return undefined;
  if (typeof invoice.status === "string") return invoice.status;
  const active = invoice.status.find((s) => s.value);
  return active?.key;
}

function StatusBadge({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    Paid: "bg-green-100 text-green-800",
    Due: "bg-yellow-100 text-yellow-800",
    Overdue: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-800",
    Rejected: "bg-orange-100 text-orange-800",
  };

  const color = colors[status ?? ""] ?? "bg-blue-100 text-blue-800";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {status ?? "Unknown"}
    </span>
  );
}
