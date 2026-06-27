import { describe, it, expect } from "vitest";
import { ApiError, readApiError } from "@/lib/api/errors";

describe("ApiError", () => {
  it("stores the upstream status code", () => {
    const error = new ApiError("Unauthorized", 401);
    expect(error.status).toBe(401);
    expect(error.message).toBe("Unauthorized");
  });
});

describe("readApiError", () => {
  it("builds an ApiError from a failed response", async () => {
    const response = new Response("token expired", { status: 401 });

    const error = await readApiError(response, "Failed to fetch invoices");

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(401);
    expect(error.message).toContain("Failed to fetch invoices");
    expect(error.message).toContain("token expired");
  });
});
