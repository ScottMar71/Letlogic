import { Card } from "@/components/ui/card";
import type { AssessmentSummary } from "@/lib/screening/queries";

type DashboardRiskSummaryProps = {
  screenings: AssessmentSummary[];
};

const RISK_ORDER = ["low", "medium", "high"] as const;

const RISK_STYLES: Record<string, { bar: string; label: string }> = {
  low: { bar: "bg-success", label: "text-success" },
  medium: { bar: "bg-warning", label: "text-warning" },
  high: { bar: "bg-danger", label: "text-danger" },
};

const RISK_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function DashboardRiskSummary({ screenings }: DashboardRiskSummaryProps) {
  if (screenings.length === 0) return null;

  const counts = { low: 0, medium: 0, high: 0 };
  for (const s of screenings) {
    if (s.riskLevel === "low" || s.riskLevel === "medium" || s.riskLevel === "high") {
      counts[s.riskLevel]++;
    }
  }

  const total = screenings.length;
  const dominant = RISK_ORDER.reduce(
    (best, level) => (counts[level] > counts[best] ? level : best),
    RISK_ORDER[0],
  );

  return (
    <Card padding="sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">Risk overview</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Based on your {total} most recent screening{total === 1 ? "" : "s"}
          </p>
        </div>
        <p className="text-xs text-text-subtle">
          Mostly{" "}
          <span className={`font-semibold ${RISK_STYLES[dominant].label}`}>
            {RISK_LABELS[dominant]}
          </span>
        </p>
      </div>

      <div
        className="mt-4 flex h-2 overflow-hidden rounded-full bg-surface-muted"
        role="img"
        aria-label={`Risk distribution: ${RISK_ORDER.map((l) => `${counts[l]} ${l}`).join(", ")}`}
      >
        {RISK_ORDER.map((level) => {
          const pct = (counts[level] / total) * 100;
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
        {RISK_ORDER.map((level) => (
          <li key={level} className="flex items-center gap-1.5 text-xs text-text-muted">
            <span
              className={`h-2 w-2 rounded-full ${RISK_STYLES[level].bar}`}
              aria-hidden
            />
            {RISK_LABELS[level]} · {counts[level]}
          </li>
        ))}
      </ul>
    </Card>
  );
}
