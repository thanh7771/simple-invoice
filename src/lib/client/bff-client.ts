import { isSessionExpiredResponse } from "@/lib/api/bff-response";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class BffError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "BffError";
  }
}

export async function handleUnauthorized(): Promise<never> {
  const { BFF_ENDPOINTS, APP_ROUTES } = await import("@/lib/api/endpoints");

  await fetch(BFF_ENDPOINTS.auth.logout, { method: "POST" });
  window.location.assign(APP_ROUTES.login);
  throw new UnauthorizedError();
}

function getErrorMessage(data: unknown, fallback: string): string {
  return typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
    ? data.message
    : fallback;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && isSessionExpiredResponse(data)) {
    await handleUnauthorized();
  }

  if (!response.ok) {
    throw new BffError(getErrorMessage(data, "Request failed"), response.status);
  }

  return data as T;
}

export async function bffFetch<T>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  return handleResponse<T>(response);
}

export async function bffFetchVoid(
  input: string,
  init?: RequestInit
): Promise<void> {
  const response = await fetch(input, init);
  await handleResponse(response);
}
