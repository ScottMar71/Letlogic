import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { BillingActions } from "@/components/screening/billing-actions";
import { CreditBalance } from "@/components/screening/credit-balance";
import { getCreditBalance } from "@/lib/screening/credits";
import { isPro } from "@/lib/screening/entitlements";
import { formatGbp } from "@/lib/screening/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");

  const admin = createAdminClient();
  const [balance, pro, { data: purchases }] = await Promise.all([
    getCreditBalance(admin, user.id),
    isPro(admin, user.id),
    admin
      .from("purchases")
      .select("id, amount_pence, credits_total, status, created_at, type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="narrow" />

      <main className="mx-auto max-w-[var(--container-narrow)] space-y-8 px-4 py-8">
        <h1 className="text-2xl font-bold text-text">Settings</h1>

        <section className="space-y-3 rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-text-subtle">Signed in as</p>
              <p className="truncate font-medium text-text">{user.email}</p>
            </div>
            <span
              className={`badge ${
                pro ? "bg-brand-600 text-text-on-teal" : "bg-brand-50 text-text-muted"
              }`}
            >
              {pro ? "Pro" : "Pay as you go"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm text-text-muted">Credit balance</span>
            <CreditBalance balance={balance} />
          </div>
          <div className="border-t border-border pt-3">
            <BillingActions isPro={pro} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="section-label">Purchase history</h2>
          {!purchases || purchases.length === 0 ? (
            <p className="text-sm text-text-subtle">No purchases yet.</p>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {purchases.map((p) => (
                <li
                  key={p.id as string}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <p className="text-text">
                      {p.credits_total} credit{p.credits_total === 1 ? "" : "s"}
                    </p>
                    <p className="text-xs text-text-subtle">
                      {new Date(p.created_at as string).toLocaleDateString("en-GB")}{" "}
                      · {p.status}
                    </p>
                  </div>
                  <span className="font-medium text-text">
                    {formatGbp(p.amount_pence as number)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
