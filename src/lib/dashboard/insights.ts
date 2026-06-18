import type {
  AssessmentSummary,
  PropertyRow,
  PropertyScreeningActivity,
} from "@/lib/screening/queries";
import type { Recommendation } from "@/lib/screening/types";

const RISK_LEVELS = ["low", "medium", "high"] as const;
const RECOMMENDATIONS = [
  "proceed",
  "proceed_with_conditions",
  "do_not_proceed",
] as const satisfies readonly Recommendation[];

export type RiskLevel = (typeof RISK_LEVELS)[number];

export type DashboardAction =
  | {
      kind: "review_do_not_proceed";
      count: number;
      href: string;
    }
  | {
      kind: "high_risk_this_week";
      count: number;
      href: string;
    }
  | {
      kind: "unlinked_screenings";
      count: number;
      href: string;
    }
  | {
      kind: "property_without_screenings";
      propertyId: string;
      address: string;
      href: string;
    }
  | {
      kind: "compare_ready";
      propertyId: string;
      address: string;
      count: number;
      href: string;
    };

export type DashboardInsights = {
  screeningCount: number;
  riskCounts: Record<RiskLevel, number>;
  recommendationCounts: Record<Recommendation, number>;
  dominantRisk: RiskLevel;
  avgIncomeMultiple: number | null;
  avgRiskScore: number | null;
  avgJobStability: number | null;
  avgTenancyStability: number | null;
  highRiskThisWeek: number;
  unlinkedScreenings: number;
  actions: DashboardAction[];
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return round1(values.reduce((sum, v) => sum + v, 0) / values.length);
}

function isWithinDays(iso: string, days: number): boolean {
  const created = new Date(iso).getTime();
  return Date.now() - created <= days * 86_400_000;
}

export function computeDashboardInsights(
  screenings: AssessmentSummary[],
  properties: PropertyRow[],
  propertyActivity: Record<string, PropertyScreeningActivity>,
): DashboardInsights {
  const riskCounts: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0 };
  const recommendationCounts: Record<Recommendation, number> = {
    proceed: 0,
    proceed_with_conditions: 0,
    do_not_proceed: 0,
  };

  const incomeMultiples: number[] = [];
  const riskScores: number[] = [];
  const jobStabilityScores: number[] = [];
  const tenancyStabilityScores: number[] = [];
  let highRiskThisWeek = 0;
  let unlinkedScreenings = 0;
  let doNotProceedCount = 0;

  for (const screening of screenings) {
    if (
      screening.riskLevel === "low" ||
      screening.riskLevel === "medium" ||
      screening.riskLevel === "high"
    ) {
      riskCounts[screening.riskLevel]++;
    }

    if (
      screening.recommendation === "proceed" ||
      screening.recommendation === "proceed_with_conditions" ||
      screening.recommendation === "do_not_proceed"
    ) {
      recommendationCounts[screening.recommendation]++;
      if (screening.recommendation === "do_not_proceed") {
        doNotProceedCount++;
      }
    }

    if (screening.incomeMultiple != null) {
      incomeMultiples.push(screening.incomeMultiple);
    }
    riskScores.push(screening.riskScore);
    if (screening.jobStabilityScore != null) {
      jobStabilityScores.push(screening.jobStabilityScore);
    }
    if (screening.tenancyStabilityScore != null) {
      tenancyStabilityScores.push(screening.tenancyStabilityScore);
    }

    if (screening.riskLevel === "high" && isWithinDays(screening.createdAt, 7)) {
      highRiskThisWeek++;
    }
    if (!screening.propertyId) {
      unlinkedScreenings++;
    }
  }

  const dominantRisk = RISK_LEVELS.reduce(
    (best, level) => (riskCounts[level] > riskCounts[best] ? level : best),
    RISK_LEVELS[0],
  );

  const actions: DashboardAction[] = [];

  if (doNotProceedCount > 0) {
    actions.push({
      kind: "review_do_not_proceed",
      count: doNotProceedCount,
      href: "/dashboard?recommendation=do_not_proceed",
    });
  }

  if (highRiskThisWeek > 0) {
    actions.push({
      kind: "high_risk_this_week",
      count: highRiskThisWeek,
      href: "/dashboard?risk=high",
    });
  }

  if (unlinkedScreenings > 0) {
    actions.push({
      kind: "unlinked_screenings",
      count: unlinkedScreenings,
      href: "/properties",
    });
  }

  for (const property of properties) {
    const activity = propertyActivity[property.id];
    if (!activity) {
      actions.push({
        kind: "property_without_screenings",
        propertyId: property.id,
        address: property.addressLine1,
        href: `/properties/${property.id}`,
      });
    } else if (activity.screeningCount >= 2) {
      actions.push({
        kind: "compare_ready",
        propertyId: property.id,
        address: property.addressLine1,
        count: activity.screeningCount,
        href: `/properties/${property.id}/compare`,
      });
    }
  }

  actions.sort((a, b) => actionPriority(a) - actionPriority(b));

  return {
    screeningCount: screenings.length,
    riskCounts,
    recommendationCounts,
    dominantRisk,
    avgIncomeMultiple: average(incomeMultiples),
    avgRiskScore: average(riskScores),
    avgJobStability: average(jobStabilityScores),
    avgTenancyStability: average(tenancyStabilityScores),
    highRiskThisWeek,
    unlinkedScreenings,
    actions: actions.slice(0, 5),
  };
}

function actionPriority(action: DashboardAction): number {
  switch (action.kind) {
    case "review_do_not_proceed":
      return 0;
    case "high_risk_this_week":
      return 1;
    case "compare_ready":
      return 2;
    case "unlinked_screenings":
      return 3;
    case "property_without_screenings":
      return 4;
  }
}

export { RISK_LEVELS, RECOMMENDATIONS };
