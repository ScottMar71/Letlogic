import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { ScreeningWorkspace } from "@/components/screening/screening-workspace";
import { ScreenCreditBanner } from "@/components/screening/screen-credit-banner";
import { PageHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { getCreditBalance } from "@/lib/screening/credits";
import { resolveIntakeForReview } from "@/lib/screening/intake";
import {
  countAssessments,
  getApplicationSourceForAssessment,
} from "@/lib/screening/queries";
import { getAuthenticatedUser } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { FunnelTracker } from "@/components/analytics/funnel-tracker";

export const metadata = privatePageMetadata("Screen an applicant");

type PageProps = {
  searchParams: Promise<{ from?: string; intake?: string; property?: string }>;
};

export default async function ScreenPage({ searchParams }: PageProps) {
  const { from, intake, property: propertyIdParam } = await searchParams;
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=/screen`);

  const admin = createAdminClient();
  const [balance, counts, reanalyseFrom, intakeLookup, propertyRow] =
    await Promise.all([
      getCreditBalance(admin, user.id),
      countAssessments(admin, user.id),
      from
        ? getApplicationSourceForAssessment(admin, user.id, from)
        : Promise.resolve(null),
      intake && !from
        ? resolveIntakeForReview(admin, user.id, intake)
        : Promise.resolve(null),
      propertyIdParam && !from && !intake
        ? admin
            .from("properties")
            .select("id, rent_amount, address_line1")
            .eq("id", propertyIdParam)
            .eq("user_id", user.id)
            .is("deleted_at", null)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const property = propertyRow?.data ?? null;
  const intakeFrom = intakeLookup?.ok ? intakeLookup.source : undefined;
  const intakeError =
    intake && !from && intakeLookup && !intakeLookup.ok ? intakeLookup : null;

  const propertyId =
    reanalyseFrom?.propertyId ??
    intakeFrom?.propertyId ??
    property?.id ??
    undefined;
  const defaultRent =
    reanalyseFrom?.rentAmount ??
    (property?.rent_amount as number | null | undefined) ??
    undefined;

  return (
    <AuthenticatedPage creditBalance={balance} width="wide" mainClassName="space-y-6">
      <FunnelTracker event="screen_started" />
      <PageHeader
        title={
          reanalyseFrom
            ? "Re-analyse applicant"
            : intakeFrom
              ? "Review applicant form"
              : "Screen an applicant"
        }
        description={
          reanalyseFrom
            ? "Update the application details below and run a new assessment (uses one credit)."
            : intakeFrom
              ? `Review what ${intakeFrom.applicantName || "the applicant"} submitted, add the monthly rent if needed, then analyse (uses one credit).`
              : property
                ? `Screening for ${property.address_line1 as string}. Paste an application or fill the form, then analyse.`
                : "Paste an application or fill the form, then analyse for a risk score and recommendation."
        }
      />

      {intakeError && (
        <Alert variant="error">
          <span className="font-medium text-text">{intakeError.message}</span>
          {intakeError.reason === "already_screened" && intakeError.assessmentId ? (
            <>
              {" "}
              <Link
                href={`/screenings/${intakeError.assessmentId}`}
                className="font-medium underline"
              >
                View report
              </Link>
            </>
          ) : (
            <>
              {" "}
              <Link href="/dashboard" className="font-medium underline">
                Back to dashboard
              </Link>
            </>
          )}
        </Alert>
      )}

      {balance === 0 && <ScreenCreditBanner balance={balance} />}

      {counts.total === 0 ? (
        <Alert variant="info">
          <span className="font-medium text-text">AI-generated screening aid.</span>{" "}
          Not a credit check, referencing report, or legal advice. Verify
          documents independently and comply with the Equality Act 2010.
        </Alert>
      ) : null}

      <ScreeningWorkspace
        key={
          reanalyseFrom?.applicationId ??
          intakeFrom?.intakeLinkId ??
          propertyId ??
          "new"
        }
        propertyId={propertyId}
        defaultRent={defaultRent ?? undefined}
        reanalyseFrom={reanalyseFrom ?? undefined}
        intakeFrom={intakeFrom}
        isFirstScreening={counts.total === 0}
        creditBalance={balance}
      />
    </AuthenticatedPage>
  );
}
