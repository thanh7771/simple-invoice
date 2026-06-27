import { NextResponse } from "next/server";
import { getAuthTokens } from "@/lib/auth/cookies";
import { fetchUserProfile } from "@/lib/api/auth";

export async function GET() {
  const { accessToken } = await getAuthTokens();

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const profile = await fetchUserProfile(accessToken);
    return NextResponse.json({
      authenticated: true,
      user: {
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
