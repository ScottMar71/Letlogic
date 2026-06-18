import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { DashboardLists } from "@/components/dashboard/dashboard-lists";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { OnboardingChecklist } from "@/components/onboarding/checklist";
import { PageHeader } from "@/components/ui/page-header";
import { getCreditBalance } from "@/lib/screening/credits";
import {
  countAssessments,
  listProperties,
  listRecentAssessments,
} from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Dashboard");

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const admin = createAdminClient();
  const [balance, recent, properties, counts] = await Promise.all([
    getCreditBalance(admin, user.id),
    listRecentAssessments(admin, user.id, 50),
    listProperties(admin, user.id),
    countAssessments(admin, user.id),
  ]);

  const displayName =
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader creditBalance={balance} width="content" />

      <main id="main-content" className="mx-auto max-w-[var(--container-content)] space-y-8 px-4 py-8">
        <PageHeader
          title={`Welcome back, ${displayName}`}
          description={
            balance === 0
              ? "You’re out of credits — top up in Settings to run your next screening."
              : counts.total === 0
                ? "Get started by screening an applicant or viewing a sample report."
                : "Here’s what’s happening with your screenings and properties."
          }
          actions={
            <div className="flex flex-wrap gap-2">
              <Link href="/sample" className="btn-secondary">
                View sample
              </Link>
              <Link href="/screen" className="btn-primary">
                New screening
              </Link>
            </div>
          }
        />

        <DashboardStats
          balance={balance}
          propertyCount={properties.length}
          screeningCount={counts.total}
          screeningsThisMonth={counts.thisMonth}
        />

        <OnboardingChecklist
          hasScreenings={counts.total > 0}
          hasProperties={properties.length > 0}
        />

        <DashboardLists screenings={recent} properties={properties} />
      </main>
    </div>
  );
}
