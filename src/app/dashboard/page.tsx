import Link from "next/link";
import { Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { CreditAlertBanner } from "@/components/dashboard/credit-alert-banner";
import { DashboardLists } from "@/components/dashboard/dashboard-lists";
import { DashboardPortfolioSummary } from "@/components/dashboard/dashboard-portfolio-summary";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { OnboardingChecklist } from "@/components/onboarding/checklist";
import { PageHeader } from "@/components/ui/page-header";
import { getCreditBalance } from "@/lib/screening/credits";
import {
  countAssessments,
  listProperties,
  listPropertyScreeningActivity,
  listRecentAssessments,
} from "@/lib/screening/queries";
import { getAuthenticatedUser, getCachedIsAdmin } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Dashboard");

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ risk?: string; recommendation?: string }>;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?next=/dashboard");

  const isAdmin = await getCachedIsAdmin();
  const { risk, recommendation } = await searchParams;

  const admin = createAdminClient();
  const [balance, recent, properties, counts, propertyActivity] = await Promise.all([
    getCreditBalance(admin, user.id),
    listRecentAssessments(admin, user.id, 50),
    listProperties(admin, user.id),
    countAssessments(admin, user.id),
    listPropertyScreeningActivity(admin, user.id),
  ]);

  const displayName =
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  const propertyLabels = Object.fromEntries(
    properties.map((p) => [p.id, p.addressLine1]),
  );

  return (
    <AuthenticatedPage creditBalance={balance} width="content">
      <PageHeader
        title={`Welcome back, ${displayName}`}
        description={
          balance === 0
            ? "Top up credits below to run your next screening."
            : counts.total === 0
              ? "Get started by screening an applicant or viewing a sample report."
              : "Here’s what’s happening with your screenings and properties."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            {isAdmin ? (
              <Link href="/admin" className="btn-secondary inline-flex items-center gap-2">
                <Shield className="h-4 w-4" aria-hidden />
                Admin
              </Link>
            ) : null}
            <Link href="/sample" className="btn-secondary">
              View sample
            </Link>
            <Link
              href="/screen"
              className={`btn-primary ${balance === 0 ? "pointer-events-none opacity-50" : ""}`}
              aria-disabled={balance === 0}
              tabIndex={balance === 0 ? -1 : undefined}
            >
              New screening
            </Link>
          </div>
        }
      />

      <CreditAlertBanner balance={balance} />

      <DashboardStats
        balance={balance}
        propertyCount={properties.length}
        screeningCount={counts.total}
        screeningsThisMonth={counts.thisMonth}
      />

      <QuickActions balance={balance} hasScreenings={counts.total > 0} />

      {counts.total > 0 ? (
        <DashboardPortfolioSummary
          screenings={recent}
          properties={properties}
          propertyActivity={propertyActivity}
          totalScreenings={counts.total}
        />
      ) : null}

      <OnboardingChecklist
        hasScreenings={counts.total > 0}
        hasProperties={properties.length > 0}
      />

      <DashboardLists
        screenings={recent}
        properties={properties}
        propertyActivity={propertyActivity}
        propertyLabels={propertyLabels}
        initialRiskFilter={risk ?? "all"}
        initialRecommendationFilter={recommendation ?? "all"}
      />
    </AuthenticatedPage>
  );
}
