import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function logoutSession(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function logoutAndRedirect(
  router: AppRouterInstance
): Promise<void> {
  await logoutSession();
  router.push("/login");
  router.refresh();
}

export async function handleUnauthorizedResponse(
  response: Response,
  router: AppRouterInstance
): Promise<boolean> {
  if (response.status !== 401) {
    return false;
  }

  await logoutAndRedirect(router);
  return true;
}
