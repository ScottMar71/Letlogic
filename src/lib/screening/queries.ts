import type { SupabaseClient } from "@supabase/supabase-js";
import type { Metrics } from "@/lib/screening/metrics";
import type { AssessmentRecord } from "@/lib/screening/types";

export type AssessmentSummary = {
  id: string;
  applicantName: string;
  propertyId: string | null;
  riskScore: number;
  riskLevel: string;
  recommendation: string;
  incomeMultiple: number | null;
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
  "id, risk_score, risk_level, recommendation, created_at, applications!inner(applicant_name, property_id, income_multiple)";

function toSummary(row: Record<string, unknown>): AssessmentSummary {
  const app = (row.applications ?? {}) as Partial<ApplicationJoin>;
  return {
    id: row.id as string,
    applicantName: app.applicant_name ?? "Applicant",
    propertyId: app.property_id ?? null,
    riskScore: row.risk_score as number,
    riskLevel: row.risk_level as string,
    recommendation: row.recommendation as string,
    incomeMultiple: app.income_multiple ?? null,
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
): Promise<AssessmentSummary[]> {
  const { data } = await admin
    .from("assessments")
    .select(SUMMARY_SELECT)
    .eq("user_id", userId)
    .eq("applications.property_id", propertyId)
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
      "*, applications!inner(applicant_name, income_multiple, job_stability_score, tenancy_stability_score)",
    )
    .eq("user_id", userId)
    .eq("id", assessmentId)
    .single();

  if (!data) return null;
  const row = data as Record<string, unknown>;
  const app = (row.applications ?? {}) as Partial<ApplicationJoin>;
  const metrics: Metrics = {
    incomeMultiple: app.income_multiple ?? null,
    jobStabilityScore: app.job_stability_score ?? null,
    tenancyStabilityScore: app.tenancy_stability_score ?? null,
  };

  return {
    id: row.id as string,
    applicationId: row.application_id as string,
    applicantName: app.applicant_name ?? "Applicant",
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

export type PropertyRow = {
  id: string;
  addressLine1: string;
  city: string;
  postcode: string;
  rentAmount: number | null;
};

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
