import { BFF_ENDPOINTS } from "@/lib/api/endpoints";
import { bffFetch, bffFetchVoid } from "@/lib/client/bff-client";
import type { LoginFormData } from "@/lib/validations/login";

export interface LoginResponse {
  message: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
}

export function loginRequest(data: LoginFormData) {
  return bffFetch<LoginResponse>(BFF_ENDPOINTS.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function logoutRequest() {
  return bffFetchVoid(BFF_ENDPOINTS.auth.logout, { method: "POST" });
}
