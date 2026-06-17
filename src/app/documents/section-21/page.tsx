import type { Metadata } from "next";
import Link from "next/link";
import { Section21Wizard } from "@/components/documents/section-21-wizard";
import { LegalDisclaimer, TrustBar } from "@/components/documents/trust-bar";
import { section21Config } from "@/lib/documents/section-21/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: section21Config.seoTitle,
  description: section21Config.seoDescription,
};

export default async function Section21Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-semibold text-zinc-900">
            LetLogic
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <span className="text-zinc-600">{user.email}</span>
            ) : (
              <Link href="/login" className="text-zinc-700 underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Section 21 Notice Generator (UK)
          </h1>
          <p className="text-lg text-zinc-600">
            Fill in your tenancy details, preview a watermarked draft, then
            download the final document for{" "}
            <strong>
              £{(section21Config.pricePence / 100).toFixed(2)}
            </strong>
            .
          </p>
          <TrustBar lastUpdated={section21Config.lastUpdated} />
        </div>

        <Section21Wizard isAuthenticated={!!user} />

        <LegalDisclaimer />
      </main>
    </div>
  );
}
