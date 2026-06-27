"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createInvoiceRequest,
  fetchInvoiceList,
  type InvoiceListFilters,
} from "@/lib/client/invoices-api";
import { queryKeys } from "@/lib/client/query-keys";
import type { CreateInvoiceFormData } from "@/lib/validations/invoice";

export function useInvoiceList(
  filters: InvoiceListFilters,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.invoices.list(filters),
    queryFn: () => fetchInvoiceList(filters),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceFormData) => createInvoiceRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}
