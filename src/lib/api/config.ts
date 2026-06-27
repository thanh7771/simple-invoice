export function getApiConfig() {
  const tokenUrl = process.env.OAUTH_TOKEN_URL;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!tokenUrl || !clientId || !clientSecret || !apiBaseUrl) {
    throw new Error(
      "Missing required environment variables. Copy .env.example to .env.local and fill in values."
    );
  }

  return { tokenUrl, clientId, clientSecret, apiBaseUrl };
}
