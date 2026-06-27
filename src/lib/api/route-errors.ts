import { NextResponse } from "next/server";
import { ApiError } from "./errors";
import {
  isUpstreamAuthFailure,
  sessionExpiredResponse,
} from "./bff-response";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function handleApiRouteError(
  error: unknown,
  fallbackMessage: string
) {
  if (error instanceof ApiError) {
    if (isUpstreamAuthFailure(error.message, error.status)) {
      await clearAuthCookies();
      return sessionExpiredResponse();
    }

    return NextResponse.json(
      { message: error.message },
      { status: error.status }
    );
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  return NextResponse.json({ message }, { status: 500 });
}
