"use server";

import OpenAI from "openai";
import { z } from "zod";
import { isPro } from "@/lib/screening/entitlements";
import { getPropertyForUser, listAssessmentsForProperty } from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const comparisonSchema = z.object({
  best_applicant: z.string(),
  rationale: z.string(),
});

export type ComparisonResult =
  | {
      ok: true;
      bestApplicant: string;
      rationale: string;
    }
  | { ok: false; code: "AUTH" | "PRO_REQUIRED" | "NOT_ENOUGH" | "FAILED"; error: string };

export async function compareApplicants(
  propertyId: string,
): Promise<ComparisonResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, code: "AUTH", error: "Please sign in." };

  const admin = createAdminClient();
  if (!(await isPro(admin, user.id))) {
    return {
      ok: false,
      code: "PRO_REQUIRED",
      error: "Comparison is a Pro feature.",
    };
  }

  const property = await getPropertyForUser(admin, user.id, propertyId);
  if (!property) {
    return {
      ok: false,
      code: "NOT_ENOUGH",
      error: "Property not found.",
    };
  }

  const applicants = await listAssessmentsForProperty(admin, user.id, propertyId);
  if (applicants.length < 2) {
    return {
      ok: false,
      code: "NOT_ENOUGH",
      error: "Screen at least two applicants to compare.",
    };
  }

  const lines = applicants
    .map(
      (a) =>
        `- ${a.applicantName}: risk ${a.riskScore}/100 (${a.riskLevel}), recommendation ${a.recommendation}, income multiple ${a.incomeMultiple ?? "unknown"}`,
    )
    .join("\n");

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You help a UK landlord choose between screened tenant applicants. Pick the best fit on financial and tenancy-stability grounds only. Never use protected characteristics. Output JSON: { best_applicant: string, rationale: string }.",
        },
        {
          role: "user",
          content: `Applicants for one property:\n${lines}\n\nWhich is the best fit and why? Mention the key trade-off.`,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("empty");
    const parsed = comparisonSchema.parse(JSON.parse(raw));
    return {
      ok: true,
      bestApplicant: parsed.best_applicant,
      rationale: parsed.rationale,
    };
  } catch {
    return { ok: false, code: "FAILED", error: "Could not generate comparison." };
  }
}
