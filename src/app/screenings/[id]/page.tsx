import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { PrintReportButton } from "@/components/screening/print-report-button";
import { PrintReportHeader } from "@/components/screening/print-report-header";
import { PageHeader } from "@/components/ui/page-header";
import { withHomeBreadcrumb } from "@/lib/navigation/breadcrumbs";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { getAssessmentDetail, listAssessmentHistoryForApplication } from "@/lib/screening/queries";
import { isPro } from "@/lib/screening/entitlements";
import { getAuthenticatedUser } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Screening report");

type PageProps = { params: Promise<{ id: string }> };

export default async function ScreeningDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=/screenings/${id}`);

  const admin = createAdminClient();
  const assessment = await getAssessmentDetail(admin, user.id, id);
  if (!assessment) notFound();

  const [pro, history] = await Promise.all([
    isPro(admin, user.id),
    listAssessmentHistoryForApplication(admin, user.id, assessment.applicationId),
  ]);

  const created = formatDate(assessment.createdAt);

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
            <PrintReportButton isPro={pro} />
          </div>
        }
      />

      <PrintReportHeader
        applicantName={assessment.applicantName}
        screenedAt={created}
        showBranding={pro}
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
