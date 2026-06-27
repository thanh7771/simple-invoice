import { NextRequest, NextResponse } from "next/server";
import { fetchInvoices } from "@/lib/api/invoices";
import { createInvoice } from "@/lib/api/invoices";
import { handleApiRouteError } from "@/lib/api/route-errors";
import { sessionExpiredResponse } from "@/lib/api/bff-response";
import { getAuthTokensFromRequest } from "@/lib/auth/cookies";
import {
  buildInvoicePayload,
  createInvoiceSchema,
} from "@/lib/validations/invoice";
import { parseInvoiceListQuery } from "@/lib/validations/invoice-list";

export async function GET(request: NextRequest) {
  const { accessToken, orgToken } = getAuthTokensFromRequest(request);

  if (!accessToken || !orgToken) {
    return sessionExpiredResponse();
  }

  const parsed = parseInvoiceListQuery(request.nextUrl.searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const data = await fetchInvoices(accessToken, orgToken, parsed.data);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiRouteError(error, "Failed to fetch invoices");
  }
}

export async function POST(request: NextRequest) {
  const { accessToken, orgToken } = getAuthTokensFromRequest(request);

  if (!accessToken || !orgToken) {
    return sessionExpiredResponse();
  }

  try {
    const body = await request.json();
    const parsed = createInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = buildInvoicePayload(parsed.data);
    const result = await createInvoice(accessToken, orgToken, payload);

    return NextResponse.json(
      { message: "Invoice created successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    return handleApiRouteError(error, "Failed to create invoice");
  }
}
