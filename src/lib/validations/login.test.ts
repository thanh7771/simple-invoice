import { describe, it, expect } from "vitest";
import { loginSchema } from "@/lib/validations/login";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      username: "94756921275",
      password: "Password@12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty username", () => {
    const result = loginSchema.safeParse({
      username: "",
      password: "Password@12345",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Username is required");
    }
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      username: "94756921275",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Password must be at least 8 characters"
      );
    }
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      username: "94756921275",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
