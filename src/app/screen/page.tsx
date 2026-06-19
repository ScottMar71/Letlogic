import { redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { ScreeningWorkspace } from "@/components/screening/screening-workspace";
import { ScreenCreditBanner } from "@/components/screening/screen-credit-banner";
import { PageHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { getCreditBalance } from "@/lib/screening/credits";
import { countAssessments, getApplicationSourceForAssessment } from "@/lib/screening/queries";
import { getAuthenticatedUser } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { FunnelTracker } from "@/components/analytics/funnel-tracker";

export const metadata = privatePageMetadata("Screen an applicant");

type PageProps = { searchParams: Promise<{ from?: string }> };

export default async function ScreenPage({ searchParams }: PageProps) {
  const { from } = await searchParams;
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=/screen`);

  const admin = createAdminClient();
  const [balance, counts, reanalyseFrom] = await Promise.all([
    getCreditBalance(admin, user.id),
    countAssessments(admin, user.id),
    from
      ? getApplicationSourceForAssessment(admin, user.id, from)
      : Promise.resolve(null),
  ]);

  return (
    <AuthenticatedPage creditBalance={balance} width="wide" mainClassName="space-y-6">
      <FunnelTracker event="screen_started" />
      <PageHeader
        title={reanalyseFrom ? "Re-analyse applicant" : "Screen an applicant"}
        description={
          reanalyseFrom
            ? "Update the application details below and run a new assessment (uses one credit)."
            : "Paste an application or fill the form, then analyse for a risk score and recommendation."
        }
      />

      {balance === 0 && <ScreenCreditBanner balance={balance} />}

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
        isFirstScreening={counts.total === 0}
      />
    </AuthenticatedPage>
  );
}
