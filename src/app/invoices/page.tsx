import { AppHeader } from "@/components/layout/AppHeader";
import { InvoiceList } from "@/components/invoices/InvoiceList";
import { getAuthTokens } from "@/lib/auth/cookies";
import { fetchUserProfile } from "@/lib/api/auth";

export default async function InvoicesPage() {
  let userName = "";

  try {
    const { accessToken } = await getAuthTokens();
    if (accessToken) {
      const profile = await fetchUserProfile(accessToken);
      userName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
    }
  } catch {
    // User name is optional in header
  }

  return (
    <>
      <AppHeader userName={userName} />
      <main className="mx-auto w-full max-w-7xl flex-1 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <InvoiceList />
      </main>
    </>
  );
}
