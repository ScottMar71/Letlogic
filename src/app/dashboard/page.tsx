import Link from "next/link";
import { Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { CreditAlertBanner } from "@/components/dashboard/credit-alert-banner";
import { DashboardLists } from "@/components/dashboard/dashboard-lists";
import { DashboardPortfolioSummary } from "@/components/dashboard/dashboard-portfolio-summary";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DashboardScreenCta } from "@/components/dashboard/dashboard-screen-cta";
import { DashboardFunnelTracker } from "@/components/analytics/dashboard-funnel-tracker";
import { IntakeLinksCard } from "@/components/dashboard/intake-links-card";
import { OnboardingChecklist } from "@/components/onboarding/checklist";
import { PageHeader } from "@/components/ui/page-header";
import { getCreditBalance } from "@/lib/screening/credits";
import { listIntakeLinks } from "@/lib/screening/intake";
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
  const [balance, recent, properties, counts, propertyActivity, intakeLinks] =
    await Promise.all([
      getCreditBalance(admin, user.id),
      listRecentAssessments(admin, user.id, 50),
      listProperties(admin, user.id),
      countAssessments(admin, user.id),
      listPropertyScreeningActivity(admin, user.id),
      listIntakeLinks(admin, user.id),
    ]);

  // Screened links live on as normal screenings; only surface actionable ones.
  const activeIntakeLinks = intakeLinks.filter(
    (link) => link.status === "pending" || link.status === "submitted",
  );

  const displayName =
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  const propertyLabels = Object.fromEntries(
    properties.map((p) => [p.id, p.addressLine1]),
  );

  return (
    <AuthenticatedPage creditBalance={balance} width="content">
      <DashboardFunnelTracker />
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
            <DashboardScreenCta balance={balance} />
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

      {activeIntakeLinks.length > 0 ? (
        <IntakeLinksCard links={activeIntakeLinks} />
      ) : null}

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
