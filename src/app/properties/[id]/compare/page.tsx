import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { BestFit } from "@/components/screening/best-fit";
import { RiskChip } from "@/components/screening/risk-chip";
import { RECOMMENDATION_LABELS } from "@/lib/screening/types";
import type { Recommendation } from "@/lib/screening/schema";
import { listAssessmentsForProperty } from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function ComparePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/properties/${id}/compare`);

  const admin = createAdminClient();
  const applicants = await listAssessmentsForProperty(admin, user.id, id);
  if (applicants.length < 2) notFound();

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="wide" />

      <main className="mx-auto max-w-[var(--container-wide)] space-y-6 px-4 py-8">
        <div>
          <Link
            href={`/properties/${id}`}
            className="text-sm text-text-subtle hover:text-text"
          >
            ← Property
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-text">Compare applicants</h1>
        </div>

        <BestFit propertyId={id} />

        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-subtle">
                <th className="sticky left-0 z-10 bg-surface px-4 py-3 font-medium">
                  Metric
                </th>
                {applicants.map((a) => (
                  <th
                    key={a.id}
                    className="whitespace-nowrap px-4 py-3 font-medium text-text"
                  >
                    {a.applicantName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-surface px-4 py-3 text-left font-normal text-text-subtle"
                >
                  Risk
                </th>
                {applicants.map((a) => (
                  <td key={a.id} className="px-4 py-3">
                    <RiskChip level={a.riskLevel} score={a.riskScore} />
                  </td>
                ))}
              </tr>
              <tr>
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-surface px-4 py-3 text-left font-normal text-text-subtle"
                >
                  Income multiple
                </th>
                {applicants.map((a) => (
                  <td key={a.id} className="whitespace-nowrap px-4 py-3 text-text">
                    {a.incomeMultiple != null ? `${a.incomeMultiple}x` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-surface px-4 py-3 text-left font-normal text-text-subtle"
                >
                  Recommendation
                </th>
                {applicants.map((a) => (
                  <td key={a.id} className="px-4 py-3 text-text">
                    {RECOMMENDATION_LABELS[a.recommendation as Recommendation] ??
                      a.recommendation}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
