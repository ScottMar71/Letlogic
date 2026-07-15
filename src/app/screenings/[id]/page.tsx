import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { PrintReportButton } from "@/components/screening/print-report-button";
import { PrintReportHeader } from "@/components/screening/print-report-header";
import { PageHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { withHomeBreadcrumb } from "@/lib/navigation/breadcrumbs";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { getAssessmentDetail, listAssessmentHistoryForApplication } from "@/lib/screening/queries";
import { canExportPdf } from "@/lib/screening/entitlements";
import { getAuthenticatedUser } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Screening report");

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    credits?: string;
    pro?: string;
    cancelled?: string;
  }>;
};

export default async function ScreeningDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { credits, pro, cancelled } = await searchParams;
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=/screenings/${id}`);

  const admin = createAdminClient();
  const assessment = await getAssessmentDetail(admin, user.id, id);
  if (!assessment) notFound();

  const [canExport, history] = await Promise.all([
    canExportPdf(admin, user.id),
    listAssessmentHistoryForApplication(admin, user.id, assessment.applicationId),
  ]);

  const created = formatDate(assessment.createdAt);
  const unlockedJustNow =
    canExport && (credits === "success" || pro === "success");

  const breadcrumbs = withHomeBreadcrumb([
    { label: "Dashboard", href: "/dashboard" },
    ...(assessment.propertyId && assessment.propertyAddress
      ? [
          { label: "Properties", href: "/properties" },
          {
            label: assessment.propertyAddress.split(",")[0] ?? "Property",
            href: `/properties/${assessment.propertyId}`,
          },
        ]
      : []),
    { label: assessment.applicantName },
  ]);

  return (
    <AuthenticatedPage width="narrow" mainClassName="space-y-4">
      <PageHeader
        title={assessment.applicantName}
        description={`Screened ${created}`}
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href={`/screen?from=${id}`} className="btn-secondary">
              Re-analyse
            </Link>
            <PrintReportButton canExport={canExport} assessmentId={id} />
          </div>
        }
      />

      {unlockedJustNow && (
        <Alert variant="success" className="no-print">
          PDF export is unlocked on your account. Use{" "}
          <span className="font-medium">Print / Save PDF</span> when you are ready.
        </Alert>
      )}
      {(credits === "success" || pro === "success") && !canExport && (
        <Alert variant="info" className="no-print">
          Payment received — PDF unlock can take a few seconds. Refresh this page
          if Print / Save PDF is still locked.
        </Alert>
      )}
      {cancelled === "1" && (
        <Alert variant="info" className="no-print">
          Checkout cancelled. You can unlock PDF export anytime from this report.
        </Alert>
      )}

      <PrintReportHeader
        applicantName={assessment.applicantName}
        screenedAt={created}
        showBranding={canExport}
      />

      <AssessmentResultPanel assessment={assessment} loading={false} error={null} />

      {history.length > 1 && (
        <section className="space-y-2">
          <h2 className="section-label">Assessment history</h2>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {history.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/screenings/${item.id}`}
                  className={`flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-muted ${
                    item.id === id ? "bg-brand-50" : ""
                  }`}
                  aria-current={item.id === id ? "page" : undefined}
                >
                  <span className="text-sm text-text">
                    {formatDateTime(item.createdAt)}
                  </span>
                  <span className="text-sm font-medium text-text">
                    Score {item.riskScore}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-text-subtle">
        AI-generated assessment — not a credit check or legal advice.
      </p>
    </AuthenticatedPage>
  );
}
