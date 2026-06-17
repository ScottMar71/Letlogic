import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { RiskChip } from "@/components/screening/risk-chip";
import { getCreditBalance } from "@/lib/screening/credits";
import {
  listProperties,
  listRecentAssessments,
} from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const admin = createAdminClient();
  const [balance, recent, properties] = await Promise.all([
    getCreditBalance(admin, user.id),
    listRecentAssessments(admin, user.id),
    listProperties(admin, user.id),
  ]);

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader creditBalance={balance} width="content" />

      <main className="mx-auto max-w-[var(--container-content)] space-y-8 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <Link href="/screen" className="btn-primary">
            New screening
          </Link>
        </div>

        <section className="space-y-3">
          <h2 className="section-label">Recent screenings</h2>
          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-strong bg-surface p-8 text-center text-sm text-text-subtle">
              No screenings yet.{" "}
              <Link href="/screen" className="text-brand-700 underline">
                Screen your first applicant
              </Link>{" "}
              or{" "}
              <Link href="/sample" className="text-brand-700 underline">
                view a sample report
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {recent.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/screenings/${a.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-muted"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-text">
                        {a.applicantName}
                      </p>
                      <p className="text-xs text-text-subtle">
                        {a.incomeMultiple != null
                          ? `${a.incomeMultiple}x income · `
                          : ""}
                        {new Date(a.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <RiskChip level={a.riskLevel} score={a.riskScore} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="section-label">Properties</h2>
            <Link
              href="/properties/new"
              className="text-sm font-medium text-brand-700 underline"
            >
              Add property
            </Link>
          </div>
          {properties.length === 0 ? (
            <p className="text-sm text-text-subtle">
              Add a property to track screenings by address.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {properties.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/properties/${p.id}`}
                    className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand-600"
                  >
                    <p className="font-medium text-text">{p.addressLine1}</p>
                    <p className="text-sm text-text-subtle">
                      {p.city}, {p.postcode}
                      {p.rentAmount ? ` · £${p.rentAmount}/mo` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
