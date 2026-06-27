import { describe, it, expect, vi } from "vitest";
import { SESSION_EXPIRED_CODE } from "./bff-response";
import { ApiError } from "./errors";
import { handleApiRouteError } from "./route-errors";

vi.mock("@/lib/auth/cookies", () => ({
  clearAuthCookies: vi.fn(),
}));

describe("handleApiRouteError", () => {
  it("forwards upstream status without mapping to 500", async () => {
    const response = await handleApiRouteError(
      new ApiError("Invalid invoice", 400),
      "Failed to create invoice"
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: "Invalid invoice" });
  });

  it("maps upstream auth 401 to session expired", async () => {
    const response = await handleApiRouteError(
      new ApiError(
        'Failed to fetch invoices (401): { "errors": [ { "code": "899.S00.401.00", "message": "Authentication failed. Missing, invalid, or expired credentials." } ] }',
        401
      ),
      "Failed to fetch invoices"
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Unauthorized",
      code: SESSION_EXPIRED_CODE,
    });
  });

  it("forwards other upstream 401 errors without logging out", async () => {
    const response = await handleApiRouteError(
      new ApiError("Failed to create invoice (401): business rule", 401),
      "Failed to create invoice"
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Failed to create invoice (401): business rule",
    });
  });
});
