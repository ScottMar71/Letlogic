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

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader creditBalance={balance} width="content" />

      <main id="main-content" className="mx-auto max-w-[var(--container-content)] space-y-8 px-4 py-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your screenings and properties."
          actions={
            <Link href="/screen" className="btn-primary">
              New screening
            </Link>
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
