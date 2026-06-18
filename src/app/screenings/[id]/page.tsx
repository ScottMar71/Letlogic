import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { PrintReportButton } from "@/components/screening/print-report-button";
import { PrintReportHeader } from "@/components/screening/print-report-header";
import { PageHeader } from "@/components/ui/page-header";
import { getAssessmentDetail, listAssessmentHistoryForApplication } from "@/lib/screening/queries";
import { isPro } from "@/lib/screening/entitlements";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Screening report");

type PageProps = { params: Promise<{ id: string }> };

export default async function ScreeningDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/screenings/${id}`);

  const admin = createAdminClient();
  const assessment = await getAssessmentDetail(admin, user.id, id);
  if (!assessment) notFound();

  const [pro, history] = await Promise.all([
    isPro(admin, user.id),
    listAssessmentHistoryForApplication(admin, user.id, assessment.applicationId),
  ]);

  const created = new Date(assessment.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const breadcrumbs = [
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
  ];

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="narrow" />

      <main id="main-content" className="mx-auto max-w-[var(--container-narrow)] space-y-4 px-4 py-8">
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
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
      </main>
    </div>
  );
}
