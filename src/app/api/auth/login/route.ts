import { NextResponse } from "next/server";
import {
  exchangeToken,
  extractOrgToken,
  fetchUserProfile,
} from "@/lib/api/auth";
import { setAuthCookies } from "@/lib/auth/cookies";
import { loginSchema } from "@/lib/validations/login";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const tokenResponse = await exchangeToken(username, password);
    const profile = await fetchUserProfile(tokenResponse.access_token);
    const orgToken = extractOrgToken(profile);

    await setAuthCookies(tokenResponse.access_token, orgToken);

    return NextResponse.json({
      message: "Login successful",
      user: {
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ message }, { status: 401 });
  }
}
