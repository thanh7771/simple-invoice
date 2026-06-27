import { describe, it, expect, afterEach, vi } from "vitest";
import {
  ACCESS_TOKEN_COOKIE,
  ORG_TOKEN_COOKIE,
  isCookieSecure,
} from "@/lib/auth/cookies";

describe("cookie constants", () => {
  it("uses prefixed cookie names to avoid collisions", () => {
    expect(ACCESS_TOKEN_COOKIE).toBe("si_access_token");
    expect(ORG_TOKEN_COOKIE).toBe("si_org_token");
  });
});

describe("isCookieSecure", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is true in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("COOKIE_SECURE", "");
    expect(isCookieSecure()).toBe(true);
  });

  it("is true when COOKIE_SECURE is true outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("COOKIE_SECURE", "true");
    expect(isCookieSecure()).toBe(true);
  });

  it("is false in development by default", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("COOKIE_SECURE", "");
    expect(isCookieSecure()).toBe(false);
  });
});

describe("cookie parsing logic", () => {
  function parseCookie(cookieHeader: string, name: string): string | undefined {
    const match = cookieHeader.match(
      new RegExp(`(?:^|;\\s*)${name}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  it("parses access token from cookie header", () => {
    const header = `si_access_token=abc123; si_org_token=xyz789`;
    expect(parseCookie(header, "si_access_token")).toBe("abc123");
    expect(parseCookie(header, "si_org_token")).toBe("xyz789");
  });

  it("returns undefined for missing cookie", () => {
    const header = "other=value";
    expect(parseCookie(header, "si_access_token")).toBeUndefined();
  });
});
