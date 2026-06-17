import Link from "next/link";
import { RiskChip } from "@/components/screening/risk-chip";
import { RECOMMENDATION_LABELS } from "@/lib/screening/types";
import type { Recommendation } from "@/lib/screening/schema";
import type { AssessmentSummary } from "@/lib/screening/queries";

export function CompareCards({ applicants }: { applicants: AssessmentSummary[] }) {
  return (
    <div className="space-y-4 md:hidden">
      {applicants.map((a) => (
        <div
          key={a.id}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/screenings/${a.id}`}
              className="font-medium text-text underline"
            >
              {a.applicantName}
            </Link>
            <RiskChip level={a.riskLevel} score={a.riskScore} />
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-subtle">Income multiple</dt>
              <dd className="text-text">
                {a.incomeMultiple != null ? `${a.incomeMultiple}x` : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-subtle">Recommendation</dt>
              <dd className="text-right text-text">
                {RECOMMENDATION_LABELS[a.recommendation as Recommendation] ??
                  a.recommendation}
              </dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
