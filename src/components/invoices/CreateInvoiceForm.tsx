"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createInvoiceSchema,
  INVOICE_CURRENCY_OPTIONS,
  INVOICE_FORM_DEFAULTS,
  type CreateInvoiceFormData,
} from "@/lib/validations/invoice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { APP_ROUTES } from "@/lib/api/endpoints";
import { getErrorMessage } from "@/lib/client/get-error-message";
import { useCreateInvoice } from "@/hooks/use-invoices";

export function CreateInvoiceForm() {
  const router = useRouter();
  const createInvoice = useCreateInvoice();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: INVOICE_FORM_DEFAULTS,
  });

  function onSubmit(data: CreateInvoiceFormData) {
    setSuccess(false);
    createInvoice.mutate(data, {
      onSuccess: () => {
        setSuccess(true);
        reset();
        setTimeout(() => router.push(APP_ROUTES.invoices), 2000);
      },
    });
  }

  const serverError = createInvoice.isError
    ? getErrorMessage(createInvoice.error, "Failed to create invoice")
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
        <p className="text-sm text-gray-500">Fill in the details below to create a new invoice with one line item.</p>
      </div>

      {success && (
        <Alert
          type="success"
          message="Invoice created successfully! Redirecting to invoice list..."
        />
      )}
      {serverError && (
        <Alert
          type="error"
          message={serverError}
          onDismiss={() => createInvoice.reset()}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        <FormSection title="Invoice Details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Invoice Number *"
              error={errors.invoiceNumber?.message}
              {...register("invoiceNumber")}
            />
            <Input
              label="Invoice Reference"
              error={errors.invoiceReference?.message}
              {...register("invoiceReference")}
            />
            <Select
              label="Currency *"
              options={INVOICE_CURRENCY_OPTIONS}
              error={errors.currency?.message}
              {...register("currency")}
            />
            <Input
              label="Invoice Date *"
              type="date"
              error={errors.invoiceDate?.message}
              {...register("invoiceDate")}
            />
            <Input
              label="Due Date *"
              type="date"
              error={errors.dueDate?.message}
              {...register("dueDate")}
            />
            <div className="sm:col-span-2">
              <Input
                label="Description *"
                error={errors.description?.message}
                {...register("description")}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Customer Details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First Name *"
              error={errors.customerFirstName?.message}
              {...register("customerFirstName")}
            />
            <Input
              label="Last Name *"
              error={errors.customerLastName?.message}
              {...register("customerLastName")}
            />
            <Input
              label="Email *"
              type="email"
              error={errors.customerEmail?.message}
              {...register("customerEmail")}
            />
            <Input
              label="Mobile Number *"
              error={errors.customerMobile?.message}
              {...register("customerMobile")}
            />
            <Input
              label="Premise / Street *"
              error={errors.premise?.message}
              {...register("premise")}
            />
            <Input
              label="City *"
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              label="County *"
              error={errors.county?.message}
              {...register("county")}
            />
            <Input
              label="Postcode *"
              error={errors.postcode?.message}
              {...register("postcode")}
            />
            <Input
              label="Country Code *"
              placeholder="e.g. VN"
              error={errors.countryCode?.message}
              {...register("countryCode")}
            />
          </div>
        </FormSection>

        <FormSection title="Bank Account">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Sort Code *"
              placeholder="09-01-01"
              error={errors.sortCode?.message}
              {...register("sortCode")}
            />
            <Input
              label="Account Number *"
              error={errors.accountNumber?.message}
              {...register("accountNumber")}
            />
            <Input
              label="Account Name *"
              error={errors.accountName?.message}
              {...register("accountName")}
            />
          </div>
        </FormSection>

        <FormSection title="Line Item (single item only)">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Item Name *"
              error={errors.itemName?.message}
              {...register("itemName")}
            />
            <Input
              label="Unit of Measure"
              error={errors.itemUOM?.message}
              {...register("itemUOM")}
            />
            <div className="sm:col-span-2">
              <Input
                label="Item Description *"
                error={errors.itemDescription?.message}
                {...register("itemDescription")}
              />
            </div>
            <Input
              label="Quantity *"
              type="number"
              min="1"
              step="1"
              error={errors.quantity?.message}
              {...register("quantity", { valueAsNumber: true })}
            />
            <Input
              label="Rate *"
              type="number"
              min="0.01"
              step="0.01"
              error={errors.rate?.message}
              {...register("rate", { valueAsNumber: true })}
            />
          </div>
        </FormSection>

        <div className="flex gap-3">
          <Button type="submit" loading={createInvoice.isPending}>
            Create Invoice
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(APP_ROUTES.invoices)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}
