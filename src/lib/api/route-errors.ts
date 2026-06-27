import { NextResponse } from "next/server";
import { ApiError } from "./errors";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function handleApiRouteError(
  error: unknown,
  fallbackMessage: string
) {
  if (error instanceof ApiError && error.status === 401) {
    await clearAuthCookies();
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  return NextResponse.json({ message }, { status: 500 });
}
