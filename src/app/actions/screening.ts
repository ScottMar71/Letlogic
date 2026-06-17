"use server";

import { generateAssessment } from "@/lib/ai/generate-assessment";
import { computeMetrics } from "@/lib/screening/metrics";
import { buildScreeningPrompt, SCREENING_PROMPT_VERSION } from "@/lib/screening/prompt";
import {
  getCreditBalance,
  refundCredit,
  spendCredit,
} from "@/lib/screening/credits";
import {
  screeningInputSchema,
  type ScreeningInput,
} from "@/lib/screening/schema";
import type { AssessmentRecord } from "@/lib/screening/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AnalyseResult =
  | { ok: true; assessment: AssessmentRecord }
  | {
      ok: false;
      code: "AUTH" | "INVALID" | "NO_CREDITS" | "FAILED";
      error: string;
    };

function metricsInputFrom(input: ScreeningInput) {
  if (input.inputMode === "form") {
    return {
      monthlyIncome: input.monthlyIncome ?? null,
      rentAmount: input.rentAmount,
      monthsInJob: input.monthsInJob ?? null,
      monthsAtAddresses: input.monthsAtCurrentAddress ?? null,
    };
  }
  // Paste mode: no reliable structured numbers, so only rent is known.
  return { rentAmount: input.rentAmount };
}

export async function analyseApplicant(
  rawInput: unknown,
): Promise<AnalyseResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, code: "AUTH", error: "Please sign in to screen an applicant." };
  }

  const parsed = screeningInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const input = parsed.data;
  const metrics = computeMetrics(metricsInputFrom(input));

  const admin = createAdminClient();

  // Debit one credit up front; bail if the balance is empty.
  const ledgerId = await spendCredit(admin, user.id);
  if (!ledgerId) {
    return {
      ok: false,
      code: "NO_CREDITS",
      error: "You have no screening credits left.",
    };
  }

  let result;
  try {
    result = await generateAssessment(buildScreeningPrompt(input, metrics));
  } catch {
    // Generation failed — refund the credit so the user isn't charged.
    await refundCredit(admin, user.id);
    return {
      ok: false,
      code: "FAILED",
      error: "We couldn't complete the assessment. Your credit was refunded — please try again.",
    };
  }

  const { data: application, error: appError } = await admin
    .from("applications")
    .insert({
      user_id: user.id,
      property_id: input.propertyId ?? null,
      applicant_name: input.applicantName,
      input_mode: input.inputMode,
      raw_text: input.inputMode === "paste" ? input.rawText : null,
      structured_data: input.inputMode === "form" ? input : null,
      monthly_income:
        input.inputMode === "form" ? input.monthlyIncome ?? null : null,
      income_multiple: metrics.incomeMultiple,
      job_stability_score: metrics.jobStabilityScore,
      tenancy_stability_score: metrics.tenancyStabilityScore,
    })
    .select("id")
    .single();

  if (appError || !application) {
    await refundCredit(admin, user.id);
    return { ok: false, code: "FAILED", error: "Could not save the application." };
  }

  const output = result.output;
  const { data: assessment, error: assessError } = await admin
    .from("assessments")
    .insert({
      application_id: application.id,
      user_id: user.id,
      risk_score: output.risk_score,
      risk_level: output.risk_level,
      recommendation: output.recommendation,
      summary: output.summary,
      pros: output.pros,
      cons: output.cons,
      conditions: output.conditions,
      suggested_questions: output.suggested_questions,
      data_gaps: output.data_gaps,
      prompt_version: SCREENING_PROMPT_VERSION,
      model: result.model,
      credit_ledger_id: ledgerId,
    })
    .select("id, created_at")
    .single();

  if (assessError || !assessment) {
    await refundCredit(admin, user.id);
    return { ok: false, code: "FAILED", error: "Could not save the assessment." };
  }

  return {
    ok: true,
    assessment: {
      ...output,
      id: assessment.id,
      applicationId: application.id,
      applicantName: input.applicantName,
      metrics,
      promptVersion: SCREENING_PROMPT_VERSION,
      model: result.model,
      createdAt: assessment.created_at,
    },
  };
}

export async function getCreditBalanceForCurrentUser(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;
  return getCreditBalance(createAdminClient(), user.id);
}
