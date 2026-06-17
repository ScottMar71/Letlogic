import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { PrintReportButton } from "@/components/screening/print-report-button";
import { PageHeader } from "@/components/ui/page-header";
import { getAssessmentDetail } from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function ScreeningDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/screenings/${id}`);

  const assessment = await getAssessmentDetail(createAdminClient(), user.id, id);
  if (!assessment) notFound();

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
          actions={<PrintReportButton />}
        />

        <AssessmentResultPanel assessment={assessment} loading={false} error={null} />

        <p className="text-xs text-text-subtle">
          AI-generated assessment — not a credit check or legal advice.
        </p>
      </main>
    </div>
  );
}
