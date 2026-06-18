import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { ScreeningWorkspace } from "@/components/screening/screening-workspace";
import { PageHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { getCreditBalance } from "@/lib/screening/credits";
import { getApplicationSourceForAssessment } from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { FunnelTracker } from "@/components/analytics/funnel-tracker";

export const metadata = privatePageMetadata("Screen an applicant");

type PageProps = { searchParams: Promise<{ from?: string }> };

export default async function ScreenPage({ searchParams }: PageProps) {
  const { from } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/screen`);

  const admin = createAdminClient();
  const [balance, reanalyseFrom] = await Promise.all([
    getCreditBalance(admin, user.id),
    from
      ? getApplicationSourceForAssessment(admin, user.id, from)
      : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader creditBalance={balance} width="wide" />

      <main id="main-content" className="mx-auto max-w-[var(--container-wide)] space-y-6 px-4 py-8">
        <FunnelTracker event="screen_started" />
        <PageHeader
          title={reanalyseFrom ? "Re-analyse applicant" : "Screen an applicant"}
          description={
            reanalyseFrom
              ? "Update the application details below and run a new assessment (uses one credit)."
              : "Paste an application or fill the form, then analyse for a risk score and recommendation."
          }
        />

        {balance === 0 && (
          <Alert variant="warning" title="No credits remaining">
            Buy credits or upgrade to Pro to run a new screening.
          </Alert>
        )}

        <Alert variant="info">
          <span className="font-medium text-text">AI-generated screening aid.</span>{" "}
          Not a credit check, referencing report, or legal advice. Verify
          documents independently and comply with the Equality Act 2010.
        </Alert>

        <ScreeningWorkspace
          key={reanalyseFrom?.applicationId ?? "new"}
          propertyId={reanalyseFrom?.propertyId ?? undefined}
          defaultRent={reanalyseFrom?.rentAmount ?? undefined}
          reanalyseFrom={reanalyseFrom ?? undefined}
        />
      </main>
    </div>
  );
}
