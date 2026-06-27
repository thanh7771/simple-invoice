import { BffError } from "@/lib/client/bff-client";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof BffError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
