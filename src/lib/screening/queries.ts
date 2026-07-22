import type { SupabaseClient } from "@supabase/supabase-js";
import type { Metrics } from "@/lib/screening/metrics";
import type {
  AssessmentRecord,
  Recommendation,
  RiskLevel,
} from "@/lib/screening/types";

export type AssessmentSummary = {
  id: string;
  applicantName: string;
  propertyId: string | null;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: Recommendation;
  summary: string | null;
  incomeMultiple: number | null;
  jobStabilityScore: number | null;
  tenancyStabilityScore: number | null;
  createdAt: string;
};

type ApplicationJoin = {
  applicant_name: string;
  property_id: string | null;
  income_multiple: number | null;
  job_stability_score: number | null;
  tenancy_stability_score: number | null;
};

const SUMMARY_SELECT =
  "id, risk_score, risk_level, recommendation, summary, created_at, applications!inner(applicant_name, property_id, income_multiple, job_stability_score, tenancy_stability_score)";

function toSummary(row: Record<string, unknown>): AssessmentSummary {
  const app = (row.applications ?? {}) as Partial<ApplicationJoin>;
  return {
    id: row.id as string,
    applicantName: app.applicant_name ?? "Applicant",
    propertyId: app.property_id ?? null,
    riskScore: row.risk_score as number,
    riskLevel: row.risk_level as RiskLevel,
    recommendation: row.recommendation as Recommendation,
    summary: (row.summary as string | null) ?? null,
    incomeMultiple: app.income_multiple ?? null,
    jobStabilityScore: app.job_stability_score ?? null,
    tenancyStabilityScore: app.tenancy_stability_score ?? null,
    createdAt: row.created_at as string,
  };
}

export async function listRecentAssessments(
  admin: SupabaseClient,
  userId: string,
  limit = 10,
): Promise<AssessmentSummary[]> {
  const { data } = await admin
    .from("assessments")
    .select(SUMMARY_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((r) => toSummary(r as Record<string, unknown>));
}

export async function listAssessmentsForProperty(
  admin: SupabaseClient,
  userId: string,
  propertyId: string,
  limit = 50,
): Promise<AssessmentSummary[]> {
  const { data } = await admin
    .from("assessments")
    .select(SUMMARY_SELECT)
    .eq("user_id", userId)
    .eq("applications.property_id", propertyId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((r) => toSummary(r as Record<string, unknown>));
}

export async function getPropertyForUser(
  admin: SupabaseClient,
  userId: string,
  propertyId: string,
): Promise<PropertyRow | null> {
  const { data } = await admin
    .from("properties")
    .select("id, address_line1, city, postcode, rent_amount")
    .eq("id", propertyId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .single();
  if (!data) return null;
  return {
    id: data.id as string,
    addressLine1: data.address_line1 as string,
    city: data.city as string,
    postcode: data.postcode as string,
    rentAmount: (data.rent_amount as number | null) ?? null,
  };
}

export async function listAssessmentHistoryForApplication(
  admin: SupabaseClient,
  userId: string,
  applicationId: string,
): Promise<AssessmentSummary[]> {
  const { data } = await admin
    .from("assessments")
    .select(SUMMARY_SELECT)
    .eq("user_id", userId)
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => toSummary(r as Record<string, unknown>));
}

export async function getAssessmentDetail(
  admin: SupabaseClient,
  userId: string,
  assessmentId: string,
): Promise<AssessmentRecord | null> {
  const { data } = await admin
    .from("assessments")
    .select(
      "*, applications!inner(applicant_name, property_id, income_multiple, job_stability_score, tenancy_stability_score, properties(address_line1, city))",
    )
    .eq("user_id", userId)
    .eq("id", assessmentId)
    .single();

  if (!data) return null;
  const row = data as Record<string, unknown>;
  const app = (row.applications ?? {}) as Partial<ApplicationJoin> & {
    properties?: { address_line1: string; city: string } | null;
  };
  const metrics: Metrics = {
    incomeMultiple: app.income_multiple ?? null,
    jobStabilityScore: app.job_stability_score ?? null,
    tenancyStabilityScore: app.tenancy_stability_score ?? null,
  };

  const property = app.properties;
  const propertyAddress = property
    ? `${property.address_line1}, ${property.city}`
    : null;

  return {
    id: row.id as string,
    applicationId: row.application_id as string,
    applicantName: app.applicant_name ?? "Applicant",
    propertyId: app.property_id ?? null,
    propertyAddress,
    risk_score: row.risk_score as number,
    risk_level: row.risk_level as AssessmentRecord["risk_level"],
    recommendation: row.recommendation as AssessmentRecord["recommendation"],
    summary: row.summary as string,
    pros: (row.pros as string[]) ?? [],
    cons: (row.cons as string[]) ?? [],
    conditions: (row.conditions as string[]) ?? [],
    suggested_questions: (row.suggested_questions as string[]) ?? [],
    data_gaps: (row.data_gaps as string[]) ?? [],
    metrics,
    promptVersion: row.prompt_version as string,
    model: row.model as string,
    createdAt: row.created_at as string,
  };
}

export async function countAssessments(
  admin: SupabaseClient,
  userId: string,
): Promise<{ total: number; thisMonth: number }> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [totalRes, monthRes] = await Promise.all([
    admin
      .from("assessments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    admin
      .from("assessments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart),
  ]);

  return {
    total: totalRes.count ?? 0,
    thisMonth: monthRes.count ?? 0,
  };
}

export type PropertyRow = {
  id: string;
  addressLine1: string;
  city: string;
  postcode: string;
  rentAmount: number | null;
};

export type PropertyScreeningActivity = {
  screeningCount: number;
  lastScreenedAt: string;
};

export async function listPropertyScreeningActivity(
  admin: SupabaseClient,
  userId: string,
): Promise<Record<string, PropertyScreeningActivity>> {
  const { data } = await admin
    .from("assessments")
    .select("created_at, applications!inner(property_id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const result: Record<string, PropertyScreeningActivity> = {};
  for (const row of data ?? []) {
    const raw = row as Record<string, unknown>;
    const app = (raw.applications ?? {}) as { property_id: string | null };
    const propertyId = app.property_id;
    if (!propertyId) continue;

    const createdAt = row.created_at as string;
    const existing = result[propertyId];
    if (!existing) {
      result[propertyId] = { screeningCount: 1, lastScreenedAt: createdAt };
    } else {
      existing.screeningCount++;
    }
  }
  return result;
}

export type ApplicationSource = {
  applicationId: string;
  applicantName: string;
  propertyId: string | null;
  inputMode: "paste" | "form";
  rawText: string | null;
  structuredData: Record<string, string> | null;
  rentAmount: number | null;
  monthlyIncome: number | null;
};

/** Load prior application input for re-analyse (via a past assessment id). */
export async function getApplicationSourceForAssessment(
  admin: SupabaseClient,
  userId: string,
  assessmentId: string,
): Promise<ApplicationSource | null> {
  const { data } = await admin
    .from("assessments")
    .select(
      "application_id, applications!inner(applicant_name, property_id, input_mode, raw_text, structured_data, monthly_income, properties(rent_amount))",
    )
    .eq("user_id", userId)
    .eq("id", assessmentId)
    .single();

  if (!data) return null;
  const row = data as Record<string, unknown>;
  const app = (row.applications ?? {}) as {
    applicant_name: string;
    property_id: string | null;
    input_mode: "paste" | "form";
    raw_text: string | null;
    structured_data: Record<string, unknown> | null;
    monthly_income: number | null;
    properties?: { rent_amount: number | null } | null;
  };

  const structured = app.structured_data;
  const formFields: Record<string, string> | null =
    structured && typeof structured === "object"
      ? Object.fromEntries(
          Object.entries(structured)
            .filter(([, v]) => v != null && typeof v !== "object")
            .map(([k, v]) => [k, String(v)]),
        )
      : null;

  return {
    applicationId: row.application_id as string,
    applicantName: app.applicant_name,
    propertyId: app.property_id,
    inputMode: app.input_mode,
    rawText: app.raw_text,
    structuredData: formFields,
    rentAmount: app.properties?.rent_amount ?? null,
    monthlyIncome: app.monthly_income,
  };
}

export async function listProperties(
  admin: SupabaseClient,
  userId: string,
): Promise<PropertyRow[]> {
  const { data } = await admin
    .from("properties")
    .select("id, address_line1, city, postcode, rent_amount")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  return (data ?? []).map((p) => ({
    id: p.id as string,
    addressLine1: p.address_line1 as string,
    city: p.city as string,
    postcode: p.postcode as string,
    rentAmount: (p.rent_amount as number | null) ?? null,
  }));
}
