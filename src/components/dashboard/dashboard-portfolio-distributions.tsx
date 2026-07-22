import { Card } from "@/components/ui/card";
import { RECOMMENDATIONS, RISK_LEVELS } from "@/lib/screening/schema";
import { RECOMMENDATION_LABELS } from "@/lib/screening/types";
import type { Recommendation, RiskLevel } from "@/lib/screening/schema";

const RISK_STYLES: Record<RiskLevel, { bar: string; label: string }> = {
  low: { bar: "bg-success", label: "text-success" },
  medium: { bar: "bg-warning", label: "text-warning" },
  high: { bar: "bg-danger", label: "text-danger" },
};

const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const RECOMMENDATION_STYLES: Record<
  Recommendation,
  { bar: string; label: string }
> = {
  proceed: { bar: "bg-success", label: "text-success" },
  proceed_with_conditions: { bar: "bg-warning", label: "text-warning" },
  do_not_proceed: { bar: "bg-danger", label: "text-danger" },
};

type DashboardPortfolioDistributionsProps = {
  screeningCount: number;
  riskCounts: Record<RiskLevel, number>;
  recommendationCounts: Record<Recommendation, number>;
};

export function DashboardPortfolioDistributions({
  screeningCount,
  riskCounts,
  recommendationCounts,
}: DashboardPortfolioDistributionsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card padding="sm">
        <p className="text-sm font-semibold text-text">Risk distribution</p>
        <p className="mt-0.5 text-xs text-text-muted">
          How recent applicants score on your risk scale
        </p>

        <div
          className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-surface-muted"
          role="img"
          aria-label={`Risk distribution: ${RISK_LEVELS.map((l) => `${riskCounts[l]} ${l}`).join(", ")}`}
        >
          {RISK_LEVELS.map((level) => {
            const pct = (riskCounts[level] / screeningCount) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={level}
                className={`${RISK_STYLES[level].bar} transition-all`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {RISK_LEVELS.map((level) => (
            <li
              key={level}
              className="flex items-center gap-1.5 text-xs text-text-muted"
            >
              <span
                className={`h-2 w-2 rounded-full ${RISK_STYLES[level].bar}`}
                aria-hidden
              />
              {RISK_LABELS[level]} · {riskCounts[level]}
              <span className="text-text-subtle">
                ({Math.round((riskCounts[level] / screeningCount) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card padding="sm">
        <p className="text-sm font-semibold text-text">Decision breakdown</p>
        <p className="mt-0.5 text-xs text-text-muted">
          AI recommendations across recent screenings
        </p>

        <div
          className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-surface-muted"
          role="img"
          aria-label={`Recommendations: ${RECOMMENDATIONS.map((r) => `${recommendationCounts[r]} ${r}`).join(", ")}`}
        >
          {RECOMMENDATIONS.map((rec) => {
            const pct = (recommendationCounts[rec] / screeningCount) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={rec}
                className={`${RECOMMENDATION_STYLES[rec].bar} transition-all`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>

        <ul className="mt-3 space-y-1.5">
          {RECOMMENDATIONS.map((rec) => (
            <li
              key={rec}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <span className="flex items-center gap-1.5 text-text-muted">
                <span
                  className={`h-2 w-2 rounded-full ${RECOMMENDATION_STYLES[rec].bar}`}
                  aria-hidden
                />
                {RECOMMENDATION_LABELS[rec]}
              </span>
              <span className="font-medium text-text">
                {recommendationCounts[rec]}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export { RISK_STYLES, RISK_LABELS };
