"use server";

import { generateAssessment } from "@/lib/ai/generate-assessment";
import { computeMetrics } from "@/lib/screening/metrics";
import { buildScreeningPrompt, SCREENING_PROMPT_VERSION } from "@/lib/screening/prompt";
import {
  refundCredit,
  spendCredit,
} from "@/lib/screening/credits";
import {
  screeningInputSchema,
  type ScreeningInput,
} from "@/lib/screening/schema";
import type { AssessmentRecord } from "@/lib/screening/types";
import { getPropertyForUser } from "@/lib/screening/queries";
import { captureServerError } from "@/lib/observability/sentry";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AnalyseResult =
  | { ok: true; assessment: AssessmentRecord }
  | {
      ok: false;
      code: "AUTH" | "INVALID" | "NO_CREDITS" | "FAILED";
      error: string;
    };

function resolveMonthlyIncome(input: ScreeningInput): number | null {
  if (input.applicantMonthlyIncome != null) return input.applicantMonthlyIncome;
  if (input.inputMode === "form") return input.monthlyIncome ?? null;
  return null;
}

function metricsInputFrom(input: ScreeningInput) {
  const monthlyIncome = resolveMonthlyIncome(input);
  if (input.inputMode === "form") {
    return {
      monthlyIncome,
      rentAmount: input.rentAmount,
      monthsInJob: input.monthsInJob ?? null,
      monthsAtAddresses: input.monthsAtCurrentAddress ?? null,
    };
  }
  return { monthlyIncome, rentAmount: input.rentAmount };
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

  if (input.propertyId) {
    const property = await getPropertyForUser(admin, user.id, input.propertyId);
    if (!property) {
      return {
        ok: false,
        code: "INVALID",
        error: "That property was not found on your account.",
      };
    }
  }

  if (input.existingApplicationId) {
    const { data: existing } = await admin
      .from("applications")
      .select("id")
      .eq("id", input.existingApplicationId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!existing) {
      return {
        ok: false,
        code: "INVALID",
        error: "That application was not found on your account.",
      };
    }
  }

  // Verify intake link ownership + submitted status before spending the credit.
  if (input.intakeLinkId) {
    const { data: intakeLink } = await admin
      .from("intake_links")
      .select("id, status")
      .eq("id", input.intakeLinkId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!intakeLink) {
      return {
        ok: false,
        code: "INVALID",
        error: "That applicant form was not found on your account.",
      };
    }
    if (intakeLink.status !== "submitted") {
      return {
        ok: false,
        code: "INVALID",
        error:
          intakeLink.status === "screened"
            ? "This applicant form has already been screened."
            : "This applicant form isn't ready to screen yet.",
      };
    }
  }

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
  } catch (err) {
    captureServerError(err, {
      tags: { area: "screening", stage: "generate" },
      extra: { userId: user.id, inputMode: input.inputMode },
    });
    // Generation failed — refund the credit so the user isn't charged.
    await refundCredit(admin, user.id);
    return {
      ok: false,
      code: "FAILED",
      error: "We couldn't complete the assessment. Your credit was refunded — please try again.",
    };
  }

  const { data: application, error: appError } = input.existingApplicationId
    ? await admin
        .from("applications")
        .update({
          applicant_name: input.applicantName,
          input_mode: input.inputMode,
          raw_text: input.inputMode === "paste" ? input.rawText : null,
          structured_data: input.inputMode === "form" ? input : null,
          monthly_income: resolveMonthlyIncome(input),
          income_multiple: metrics.incomeMultiple,
          job_stability_score: metrics.jobStabilityScore,
          tenancy_stability_score: metrics.tenancyStabilityScore,
        })
        .eq("id", input.existingApplicationId)
        .eq("user_id", user.id)
        .select("id")
        .single()
    : await admin
        .from("applications")
        .insert({
          user_id: user.id,
          property_id: input.propertyId ?? null,
          applicant_name: input.applicantName,
          input_mode: input.inputMode,
          raw_text: input.inputMode === "paste" ? input.rawText : null,
          structured_data: input.inputMode === "form" ? input : null,
          monthly_income: resolveMonthlyIncome(input),
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

  // Close the loop on an applicant-submitted intake form.
  if (input.intakeLinkId) {
    await admin
      .from("intake_links")
      .update({ status: "screened", application_id: application.id })
      .eq("id", input.intakeLinkId)
      .eq("user_id", user.id);
  }

  return {
    ok: true,
    assessment: {
      ...output,
      id: assessment.id,
      applicationId: application.id,
      applicantName: input.applicantName,
      propertyId: input.propertyId ?? null,
      metrics,
      promptVersion: SCREENING_PROMPT_VERSION,
      model: result.model,
      createdAt: assessment.created_at,
    },
  };
}
