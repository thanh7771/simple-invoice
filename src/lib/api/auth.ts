import { getApiConfig } from "./config";
import { readApiError } from "./errors";
import type {
  OAuthTokenResponse,
  UserProfileData,
  UserProfileResponse,
} from "@/lib/types/api";

export async function exchangeToken(
  username: string,
  password: string
): Promise<OAuthTokenResponse> {
  const { tokenUrl, clientId, clientSecret } = getApiConfig();

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "password",
    scope: "openid",
    username,
    password,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw await readApiError(response, "Authentication failed");
  }

  return response.json();
}

export async function fetchUserProfile(
  accessToken: string
): Promise<UserProfileData> {
  const { apiBaseUrl } = getApiConfig();

  const response = await fetch(
    `${apiBaseUrl}/membership-service/1.0.0/users/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw await readApiError(response, "Failed to fetch user profile");
  }

  const result: UserProfileResponse = await response.json();
  return result.data;
}

export function extractOrgToken(profile: UserProfileData): string {
  const orgToken = profile.memberships?.[0]?.token;
  if (!orgToken) {
    throw new Error("No organisation token found in user profile");
  }
  return orgToken;
}
