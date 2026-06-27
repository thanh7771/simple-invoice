import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ROUTES, PUBLIC_PATHS } from "@/lib/api/endpoints";
import {
  ACCESS_TOKEN_COOKIE,
  ORG_TOKEN_COOKIE,
} from "@/lib/auth/cookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const orgToken = request.cookies.get(ORG_TOKEN_COOKIE)?.value;
  const isAuthenticated = Boolean(accessToken && orgToken);
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!isAuthenticated && !isPublicPath && pathname !== APP_ROUTES.home) {
    return NextResponse.redirect(new URL(APP_ROUTES.login, request.url));
  }

  if (isAuthenticated && pathname === APP_ROUTES.login) {
    return NextResponse.redirect(new URL(APP_ROUTES.invoices, request.url));
  }

  if (pathname === APP_ROUTES.home) {
    return NextResponse.redirect(
      new URL(
        isAuthenticated ? APP_ROUTES.invoices : APP_ROUTES.login,
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
