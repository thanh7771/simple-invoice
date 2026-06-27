import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "si_access_token";
export const ORG_TOKEN_COOKIE = "si_org_token";

export function isCookieSecure(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.COOKIE_SECURE === "true"
  );
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  get secure() {
    return isCookieSecure();
  },
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60, // 1 hour
};

export async function setAuthCookies(
  accessToken: string,
  orgToken: string
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, COOKIE_OPTIONS);
  cookieStore.set(ORG_TOKEN_COOKIE, orgToken, COOKIE_OPTIONS);
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(ORG_TOKEN_COOKIE);
}

export async function getAuthTokens(): Promise<{
  accessToken: string | undefined;
  orgToken: string | undefined;
}> {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get(ACCESS_TOKEN_COOKIE)?.value,
    orgToken: cookieStore.get(ORG_TOKEN_COOKIE)?.value,
  };
}

export function getAuthTokensFromRequest(
  request: Request
): { accessToken: string | undefined; orgToken: string | undefined } {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const accessToken = parseCookie(cookieHeader, ACCESS_TOKEN_COOKIE);
  const orgToken = parseCookie(cookieHeader, ORG_TOKEN_COOKIE);
  return { accessToken, orgToken };
}

function parseCookie(
  cookieHeader: string,
  name: string
): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}
