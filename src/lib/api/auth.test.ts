import { describe, it, expect } from "vitest";
import { extractOrgToken } from "@/lib/api/auth";
import type { UserProfileData } from "@/lib/types/api";

describe("extractOrgToken", () => {
  it("extracts org token from first membership", () => {
    const profile: UserProfileData = {
      userId: "user-1",
      memberships: [
        {
          membershipId: "m-1",
          token: "org-token-abc",
          organisationId: "org-1",
        },
        {
          membershipId: "m-2",
          token: "org-token-xyz",
          organisationId: "org-2",
        },
      ],
    };

    expect(extractOrgToken(profile)).toBe("org-token-abc");
  });

  it("throws when no memberships exist", () => {
    const profile: UserProfileData = {
      userId: "user-1",
      memberships: [],
    };

    expect(() => extractOrgToken(profile)).toThrow(
      "No organisation token found in user profile"
    );
  });

  it("throws when memberships is undefined", () => {
    const profile = { userId: "user-1" } as UserProfileData;
    expect(() => extractOrgToken(profile)).toThrow(
      "No organisation token found in user profile"
    );
  });
});
