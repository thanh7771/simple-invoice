import { NextResponse } from "next/server";

export const SESSION_EXPIRED_CODE = "SESSION_EXPIRED" as const;

/** Upstream error codes that mean OAuth/org credentials are no longer valid. */
export const UPSTREAM_SESSION_ERROR_CODES = ["899.S00.401.00"] as const;

export function sessionExpiredResponse() {
  return NextResponse.json(
    { message: "Unauthorized", code: SESSION_EXPIRED_CODE },
    { status: 401 }
  );
}

export function isSessionExpiredResponse(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "code" in data &&
    data.code === SESSION_EXPIRED_CODE
  );
}

/** Upstream 401 when OAuth/org token is missing, invalid, or expired. */
export function isUpstreamAuthFailure(message: string, status: number): boolean {
  if (status !== 401) {
    return false;
  }

  if (UPSTREAM_SESSION_ERROR_CODES.some((code) => message.includes(code))) {
    return true;
  }

  const jsonStart = message.indexOf("{");
  if (jsonStart === -1) {
    return false;
  }

  try {
    const parsed = JSON.parse(message.slice(jsonStart)) as {
      errors?: Array<{ code?: string }>;
    };

    return (
      parsed.errors?.some(
        (error) =>
          typeof error.code === "string" &&
          UPSTREAM_SESSION_ERROR_CODES.includes(
            error.code as (typeof UPSTREAM_SESSION_ERROR_CODES)[number]
          )
      ) ?? false
    );
  } catch {
    return false;
  }
}
