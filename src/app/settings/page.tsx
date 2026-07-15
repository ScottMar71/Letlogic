import { redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { BillingActions } from "@/components/screening/billing-actions";
import { CreditBalance } from "@/components/screening/credit-balance";
import { PurchaseHistory } from "@/components/settings/purchase-history";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCreditBalance } from "@/lib/screening/credits";
import { isPro } from "@/lib/screening/entitlements";
import { getAuthenticatedUser } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Settings");

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();
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
    <AuthenticatedPage creditBalance={balance} width="narrow">
      <PageHeader
        title="Settings"
        description="Plan, credits, and billing for your account."
      />

      <section className="space-y-3">
        <h2 className="section-label">Account</h2>
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-text-subtle">Signed in as</p>
              <p className="truncate font-medium text-text">{user.email}</p>
            </div>
            <StatusBadge variant={pro ? "pro" : "default"}>
              {pro ? "Pro" : "Pay as you go"}
            </StatusBadge>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="section-label">Plan &amp; billing</h2>
        <Card>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-text-muted">Credit balance</span>
            <CreditBalance balance={balance} showBuy={false} />
          </div>
          <div className="pt-3">
            <BillingActions isPro={pro} />
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="section-label">Purchase history</h2>
        <PurchaseHistory
          purchases={(purchases ?? []).map((p) => ({
            id: p.id as string,
            amount_pence: p.amount_pence as number,
            credits_total: p.credits_total as number,
            status: p.status as string,
            created_at: p.created_at as string,
          }))}
        />
      </section>
    </AuthenticatedPage>
  );
}
