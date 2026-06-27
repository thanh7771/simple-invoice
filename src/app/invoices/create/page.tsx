import { AppHeader } from "@/components/layout/AppHeader";
import { CreateInvoiceForm } from "@/components/invoices/CreateInvoiceForm";
import { getAuthTokens } from "@/lib/auth/cookies";
import { fetchUserProfile } from "@/lib/api/auth";

export default async function CreateInvoicePage() {
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
      <main className="mx-auto w-full max-w-4xl flex-1 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <CreateInvoiceForm />
      </main>
    </>
  );
}
