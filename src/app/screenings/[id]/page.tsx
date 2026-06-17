import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
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

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="narrow" />

      <main className="mx-auto max-w-[var(--container-narrow)] space-y-4 px-4 py-8">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-text-subtle hover:text-text"
          >
            ← Back
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-text">
            {assessment.applicantName}
          </h1>
          <p className="text-sm text-text-subtle">Screened {created}</p>
        </div>

        <AssessmentResultPanel assessment={assessment} loading={false} error={null} />

        <p className="text-xs text-text-subtle">
          AI-generated assessment — not a credit check or legal advice.
        </p>
      </main>
    </div>
  );
}
