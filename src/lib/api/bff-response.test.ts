import { describe, it, expect } from "vitest";
import {
  SESSION_EXPIRED_CODE,
  isSessionExpiredResponse,
  isUpstreamAuthFailure,
  sessionExpiredResponse,
} from "./bff-response";

describe("sessionExpiredResponse", () => {
  it("includes a session expired code", async () => {
    const response = sessionExpiredResponse();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Unauthorized",
      code: SESSION_EXPIRED_CODE,
    });
  });
});

describe("isSessionExpiredResponse", () => {
  it("matches only BFF session responses", () => {
    expect(
      isSessionExpiredResponse({
        message: "Unauthorized",
        code: SESSION_EXPIRED_CODE,
      })
    ).toBe(true);
    expect(isSessionExpiredResponse({ message: "Unauthorized" })).toBe(false);
    expect(
      isSessionExpiredResponse({
        message: "Failed to fetch invoices (401): invalid",
      })
    ).toBe(false);
  });
});

describe("isUpstreamAuthFailure", () => {
  it("detects expired or invalid upstream credentials", () => {
    const message =
      'Failed to fetch invoices (401): { "errors": [ { "code": "899.S00.401.00", "message": "Authentication failed. Missing, invalid, or expired credentials." } ] }';

    expect(isUpstreamAuthFailure(message, 401)).toBe(true);
    expect(
      isUpstreamAuthFailure("Failed to create invoice (401): business rule", 401)
    ).toBe(false);
    expect(isUpstreamAuthFailure(message, 400)).toBe(false);
  });

  it("does not match generic authentication text without upstream error code", () => {
    expect(
      isUpstreamAuthFailure("Authentication failed (401): invalid password", 401)
    ).toBe(false);
  });
});
