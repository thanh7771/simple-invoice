"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/lib/api/endpoints";
import { loginRequest, logoutRequest } from "@/lib/client/auth-api";
import type { LoginFormData } from "@/lib/validations/login";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginFormData) => loginRequest(data),
    onSuccess: () => {
      router.push(APP_ROUTES.invoices);
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.clear();
      router.push(APP_ROUTES.login);
      router.refresh();
    },
  });
}
