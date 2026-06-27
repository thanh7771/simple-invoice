"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { logoutAndRedirect } from "@/lib/client/session";

interface AppHeaderProps {
  userName?: string;
}

export function AppHeader({ userName }: AppHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutAndRedirect(router);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/invoices" className="text-xl font-bold text-blue-600">
            SimpleInvoice
          </Link>
          <nav className="hidden gap-4 sm:flex">
            <Link
              href="/invoices"
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              Invoices
            </Link>
            <Link
              href="/invoices/create"
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              Create Invoice
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {userName && (
            <span className="hidden text-sm text-gray-600 sm:inline">
              {userName}
            </span>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            loading={loggingOut}
            className="text-sm"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
