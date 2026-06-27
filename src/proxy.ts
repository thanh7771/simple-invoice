import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  ORG_TOKEN_COOKIE,
} from "@/lib/auth/cookies";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

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

  if (!isAuthenticated && !isPublicPath && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/invoices", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isAuthenticated ? "/invoices" : "/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
