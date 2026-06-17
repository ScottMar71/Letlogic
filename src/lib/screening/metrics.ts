// Deterministic pre-LLM metrics for tenant screening.
// Pure functions, no I/O. These numeric anchors are computed in the backend and
// passed into the prompt so the model never has to derive (or hallucinate) them.

export type MetricsInput = {
  /** Applicant net monthly income, in pounds. */
  monthlyIncome?: number | null;
  /** Property monthly rent, in pounds. */
  rentAmount?: number | null;
  /** Months in the current job/role. */
  monthsInJob?: number | null;
  /** Total months of known rental/address history. */
  monthsAtAddresses?: number | null;
};

export type Metrics = {
  /** monthlyIncome / rentAmount, rounded to 2dp. Null when not computable. */
  incomeMultiple: number | null;
  /** 0–10 stability score from time in current role. Null when unknown. */
  jobStabilityScore: number | null;
  /** 0–10 stability score from rental history length. Null when unknown. */
  tenancyStabilityScore: number | null;
};

// 60 months (5 years) of continuity maps to the top score of 10.
const MONTHS_PER_STABILITY_POINT = 6;
const MAX_STABILITY_SCORE = 10;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Map a duration in months to a 0–10 stability score. Unknown input -> null. */
function stabilityScore(months?: number | null): number | null {
  if (!isFiniteNumber(months)) return null;
  const safeMonths = Math.max(0, months);
  const score = Math.round(safeMonths / MONTHS_PER_STABILITY_POINT);
  return Math.min(MAX_STABILITY_SCORE, score);
}

function computeIncomeMultiple(
  monthlyIncome?: number | null,
  rentAmount?: number | null,
): number | null {
  if (!isFiniteNumber(monthlyIncome) || monthlyIncome < 0) return null;
  if (!isFiniteNumber(rentAmount) || rentAmount <= 0) return null;
  return Math.round((monthlyIncome / rentAmount) * 100) / 100;
}

export function computeMetrics(input: MetricsInput): Metrics {
  return {
    incomeMultiple: computeIncomeMultiple(input.monthlyIncome, input.rentAmount),
    jobStabilityScore: stabilityScore(input.monthsInJob),
    tenancyStabilityScore: stabilityScore(input.monthsAtAddresses),
  };
}
