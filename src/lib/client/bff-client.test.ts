import { describe, it, expect, vi, beforeEach } from "vitest";
import { SESSION_EXPIRED_CODE } from "@/lib/api/bff-response";
import { bffFetch, BffError } from "@/lib/client/bff-client";

describe("bffFetch session redirect", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("redirects only when BFF returns SESSION_EXPIRED", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { assign: assign });

    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            message: "Unauthorized",
            code: SESSION_EXPIRED_CODE,
          }),
          { status: 401 }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Logged out successfully" }), {
          status: 200,
        })
      );

    await expect(bffFetch("/api/invoices")).rejects.toThrow();
    expect(assign).toHaveBeenCalledWith("/login");
  });

  it("does not redirect for login failure or upstream business errors", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { assign: assign });

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Invalid username or password" }), {
        status: 401,
      })
    );

    await expect(bffFetch("/api/auth/login")).rejects.toBeInstanceOf(BffError);
    expect(assign).not.toHaveBeenCalled();
  });
});
