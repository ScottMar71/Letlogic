import { DashboardPortfolioActions } from "@/components/dashboard/dashboard-portfolio-actions";
import {
  DashboardPortfolioDistributions,
  RISK_LABELS,
  RISK_STYLES,
} from "@/components/dashboard/dashboard-portfolio-distributions";
import { computeDashboardInsights } from "@/lib/dashboard/insights";
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

  const showDistributionCharts = screeningCount >= 5;

  return (
    <section className="space-y-4" aria-labelledby="portfolio-summary-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="portfolio-summary-heading"
            className="text-h3 font-semibold text-text"
          >
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

      <DashboardPortfolioActions actions={insights.actions} />

      {showDistributionCharts ? (
        <DashboardPortfolioDistributions
          screeningCount={screeningCount}
          riskCounts={riskCounts}
          recommendationCounts={recommendationCounts}
        />
      ) : null}

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
              ? `${insights.avgJobStability}/10`
              : "—"
          }
          hint="Employment consistency"
        />
        <MetricTile
          label="Tenancy stability"
          value={
            insights.avgTenancyStability != null
              ? `${insights.avgTenancyStability}/10`
              : "—"
          }
          hint="Rental history strength"
        />
      </div>
    </section>
  );
}
