import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  GitCompare,
  MapPinOff,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  computeDashboardInsights,
  RECOMMENDATIONS,
  RISK_LEVELS,
  type DashboardAction,
} from "@/lib/dashboard/insights";
import { RECOMMENDATION_LABELS } from "@/lib/screening/types";
import type {
  AssessmentSummary,
  PropertyRow,
  PropertyScreeningActivity,
} from "@/lib/screening/queries";

type DashboardPortfolioSummaryProps = {
  screenings: AssessmentSummary[];
  properties: PropertyRow[];
  propertyActivity: Record<string, PropertyScreeningActivity>;
  totalScreenings: number;
};

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

const RECOMMENDATION_STYLES: Record<string, { bar: string; label: string }> = {
  proceed: { bar: "bg-success", label: "text-success" },
  proceed_with_conditions: { bar: "bg-warning", label: "text-warning" },
  do_not_proceed: { bar: "bg-danger", label: "text-danger" },
};

function actionMessage(action: DashboardAction): string {
  switch (action.kind) {
    case "review_do_not_proceed":
      return `${action.count} applicant${action.count === 1 ? "" : "s"} flagged “Do not proceed” — review reports`;
    case "high_risk_this_week":
      return `${action.count} high-risk screening${action.count === 1 ? "" : "s"} in the last 7 days`;
    case "unlinked_screenings":
      return `${action.count} screening${action.count === 1 ? "" : "s"} not linked to a property`;
    case "property_without_screenings":
      return `${action.address} has no screenings yet`;
    case "compare_ready":
      return `${action.address} has ${action.count} applicants ready to compare`;
  }
}

function actionIcon(action: DashboardAction) {
  switch (action.kind) {
    case "review_do_not_proceed":
    case "high_risk_this_week":
      return AlertTriangle;
    case "unlinked_screenings":
      return MapPinOff;
    case "compare_ready":
      return GitCompare;
    case "property_without_screenings":
      return TrendingUp;
  }
}

function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted/50 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-text-subtle">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-bold tracking-tight text-text">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-text-muted">{hint}</p> : null}
    </div>
  );
}

export function DashboardPortfolioSummary({
  screenings,
  properties,
  propertyActivity,
  totalScreenings,
}: DashboardPortfolioSummaryProps) {
  if (screenings.length === 0) return null;

  const insights = computeDashboardInsights(
    screenings,
    properties,
    propertyActivity,
  );
  const { screeningCount, riskCounts, recommendationCounts, dominantRisk } =
    insights;

  const scopeLabel =
    screeningCount < totalScreenings
      ? `Last ${screeningCount} of ${totalScreenings} screenings`
      : `${screeningCount} screening${screeningCount === 1 ? "" : "s"}`;

  return (
    <section className="space-y-4" aria-labelledby="portfolio-summary-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="portfolio-summary-heading" className="text-h3 font-semibold text-text">
            Portfolio overview
          </h2>
          <p className="mt-0.5 text-sm text-text-muted">{scopeLabel}</p>
        </div>
        <p className="text-xs text-text-subtle">
          Mostly{" "}
          <span className={`font-semibold ${RISK_STYLES[dominantRisk].label}`}>
            {RISK_LABELS[dominantRisk]}
          </span>{" "}
          risk
        </p>
      </div>

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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Avg income multiple"
          value={
            insights.avgIncomeMultiple != null
              ? `${insights.avgIncomeMultiple}x`
              : "—"
          }
          hint="Rent affordability across recent applicants"
        />
        <MetricTile
          label="Avg risk score"
          value={
            insights.avgRiskScore != null
              ? `${insights.avgRiskScore}/100`
              : "—"
          }
          hint="Lower is better"
        />
        <MetricTile
          label="Job stability"
          value={
            insights.avgJobStability != null
              ? `${insights.avgJobStability}/100`
              : "—"
          }
          hint="Employment consistency"
        />
        <MetricTile
          label="Tenancy stability"
          value={
            insights.avgTenancyStability != null
              ? `${insights.avgTenancyStability}/100`
              : "—"
          }
          hint="Rental history strength"
        />
      </div>

      {insights.actions.length > 0 ? (
        <Card padding="sm">
          <p className="text-sm font-semibold text-text">Needs attention</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Suggested next steps based on your portfolio
          </p>
          <ul className="mt-3 space-y-2">
            {insights.actions.map((action) => {
              const Icon = actionIcon(action);
              const isUrgent =
                action.kind === "review_do_not_proceed" ||
                action.kind === "high_risk_this_week";

              return (
                <li key={`${action.kind}-${"propertyId" in action ? action.propertyId : action.href}`}>
                  <Link
                    href={action.href}
                    className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:border-brand-600 hover:bg-brand-50/30 ${
                      isUrgent
                        ? "border-warning-border bg-warning-bg/30"
                        : "border-border bg-surface"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isUrgent
                          ? "bg-warning-bg text-warning"
                          : "bg-surface-muted text-text-muted"
                      }`}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-text-muted group-hover:text-text">
                      {actionMessage(action)}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-text-subtle opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}
    </section>
  );
}
