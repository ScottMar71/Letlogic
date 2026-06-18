import type { Metrics } from "@/lib/screening/metrics";
import type { ScreeningInput } from "@/lib/screening/schema";

export const SCREENING_PROMPT_VERSION = "v1";

const SYSTEM_RULES = `You are an assistant that helps UK landlords assess residential tenant applications.
Your job is to estimate the risk of missed rent or early tenancy termination and explain your reasoning clearly.

Strict rules:
- Assess ONLY the financial and tenancy-stability risk based on the facts provided.
- NEVER base any part of your assessment on protected characteristics (race, ethnicity, religion, sex, gender, sexual orientation, disability, age, marital status, pregnancy, or nationality). Ignore them if present.
- Do NOT give legal advice and do NOT guarantee outcomes.
- Do NOT invent facts. If something important is missing, record it under data_gaps.
- Use the pre-computed metrics provided as your numeric anchors; do not recalculate them.
- Output VALID JSON only, matching the schema below. No prose outside the JSON.`;

const OUTPUT_CONTRACT = `Return JSON with exactly these keys:
{
  "risk_score": integer 0-100 (higher = more risk),
  "risk_level": "low" | "medium" | "high",
  "recommendation": "proceed" | "proceed_with_conditions" | "do_not_proceed",
  "summary": "2-3 sentence plain-English summary",
  "pros": string[] (strengths, each tied to a factor),
  "cons": string[] (concerns, each tied to a factor),
  "conditions": string[] (only if recommendation is proceed_with_conditions; e.g. guarantor, higher deposit where legal, shorter initial term),
  "suggested_questions": string[] (checks/questions the landlord should follow up on),
  "data_gaps": string[] (important missing information)
}`;

function formatMetrics(metrics: Metrics): string {
  const lines: string[] = [];
  lines.push(
    metrics.incomeMultiple != null
      ? `- Income multiple (net monthly income / rent): ${metrics.incomeMultiple}x`
      : `- Income multiple: not computable (income or rent missing)`,
  );
  lines.push(
    metrics.jobStabilityScore != null
      ? `- Job stability score (0-10): ${metrics.jobStabilityScore}`
      : `- Job stability score: unknown (time in role not provided)`,
  );
  lines.push(
    metrics.tenancyStabilityScore != null
      ? `- Tenancy stability score (0-10): ${metrics.tenancyStabilityScore}`
      : `- Tenancy stability score: unknown (rental history not provided)`,
  );
  return lines.join("\n");
}

function formatApplicant(input: ScreeningInput): string {
  if (input.inputMode === "paste") {
    return `Applicant details (free text, provided by the landlord):\n"""\n${input.rawText}\n"""`;
  }

  const fields: Array<[string, unknown]> = [
    ["Household size", input.householdSize],
    ["Employment status", input.employmentStatus],
    ["Job title", input.jobTitle],
    ["Employer", input.employer],
    ["Net monthly income (£)", input.monthlyIncome],
    ["Months in current job", input.monthsInJob],
    ["Declared debts (£)", input.declaredDebts],
    ["Disclosed adverse credit (CCJ/bankruptcy)", input.adverseCredit],
    ["Current address", input.currentAddress],
    ["Months at current address", input.monthsAtCurrentAddress],
    ["Previous landlord reference", input.previousLandlordReference],
  ];

  const provided = fields
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([label, value]) => `- ${label}: ${value}`)
    .join("\n");

  return `Applicant details (structured):\n${provided || "- (no additional details provided)"}`;
}

export function buildScreeningPrompt(
  input: ScreeningInput,
  metrics: Metrics,
): string {
  return `${SYSTEM_RULES}

Property context:
- Monthly rent: £${input.rentAmount.toFixed(2)}
- Affordability threshold: ${input.requiredIncomeMultiple}× monthly rent (UK standard)
${input.applicantMonthlyIncome != null ? `- Applicant monthly income (landlord-provided): £${input.applicantMonthlyIncome.toFixed(2)}` : ""}

Pre-computed metrics (authoritative — use these, do not recompute):
${formatMetrics(metrics)}

${formatApplicant(input)}

${OUTPUT_CONTRACT}`;
}
