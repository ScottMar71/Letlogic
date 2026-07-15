import type { SupabaseClient } from "@supabase/supabase-js";
import type { IntakeSubmission } from "@/lib/screening/schema";

export type IntakeLinkStatus = "pending" | "submitted" | "screened" | "cancelled";

export type IntakeLinkSummary = {
  id: string;
  token: string;
  status: IntakeLinkStatus;
  /** True when the link is pending but past its expiry date. */
  expired: boolean;
  applicantName: string | null;
  propertyId: string | null;
  propertyLabel: string | null;
  applicationId: string | null;
  createdAt: string;
  expiresAt: string;
  submittedAt: string | null;
};

type IntakeRow = {
  id: string;
  token: string;
  status: IntakeLinkStatus;
  applicant_name: string | null;
  property_id: string | null;
  application_id: string | null;
  created_at: string;
  expires_at: string;
  submitted_at: string | null;
  properties?: { address_line1: string; city: string } | null;
};

function isExpired(row: Pick<IntakeRow, "status" | "expires_at">): boolean {
  return row.status === "pending" && new Date(row.expires_at).getTime() < Date.now();
}

function toSummary(row: IntakeRow): IntakeLinkSummary {
  return {
    id: row.id,
    token: row.token,
    status: row.status,
    expired: isExpired(row),
    applicantName: row.applicant_name,
    propertyId: row.property_id,
    propertyLabel: row.properties
      ? `${row.properties.address_line1}, ${row.properties.city}`
      : null,
    applicationId: row.application_id,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    submittedAt: row.submitted_at,
  };
}

const INTAKE_SELECT =
  "id, token, status, applicant_name, property_id, application_id, created_at, expires_at, submitted_at, properties(address_line1, city)";

/** Active intake links for the dashboard (pending + submitted first). */
export async function listIntakeLinks(
  admin: SupabaseClient,
  userId: string,
  limit = 20,
): Promise<IntakeLinkSummary[]> {
  const { data } = await admin
    .from("intake_links")
    .select(INTAKE_SELECT)
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as unknown as IntakeRow[]).map(toSummary);
}

/** Public view of a link for the /apply/[token] page. */
export type PublicIntakeLink = {
  id: string;
  status: IntakeLinkStatus;
  expired: boolean;
  landlordName: string | null;
  propertyLabel: string | null;
};

export async function getIntakeLinkByToken(
  admin: SupabaseClient,
  token: string,
): Promise<PublicIntakeLink | null> {
  const { data } = await admin
    .from("intake_links")
    .select(
      "id, status, expires_at, properties(address_line1, city), profiles(full_name)",
    )
    .eq("token", token)
    .maybeSingle();
  if (!data) return null;

  const row = data as unknown as IntakeRow & {
    profiles?: { full_name: string | null } | null;
  };
  return {
    id: row.id,
    status: row.status,
    expired: isExpired(row),
    landlordName: row.profiles?.full_name ?? null,
    propertyLabel: row.properties
      ? `${row.properties.address_line1}, ${row.properties.city}`
      : null,
  };
}

/** Submitted intake data mapped for pre-filling the screening form. */
export type IntakeSource = {
  intakeLinkId: string;
  applicantName: string;
  propertyId: string | null;
  rentAmount: number | null;
  monthlyIncome: number | null;
  structuredData: Record<string, string>;
};

export type IntakeReviewLookup =
  | { ok: true; source: IntakeSource }
  | {
      ok: false;
      reason: "not_found" | "already_screened" | "not_ready";
      message: string;
      /** Latest screening report when the form was already analysed. */
      assessmentId?: string | null;
    };

function mapSubmittedIntake(row: {
  id: string;
  applicant_name: string | null;
  property_id: string | null;
  submitted_data: Partial<IntakeSubmission> | null;
  properties?: { rent_amount: number | null } | null;
}): IntakeSource {
  const submitted = row.submitted_data ?? {};

  // Everything except name/income maps 1:1 onto the structured form fields.
  const structuredData: Record<string, string> = {};
  const formKeys: (keyof IntakeSubmission)[] = [
    "employmentStatus",
    "jobTitle",
    "employer",
    "monthsInJob",
    "householdSize",
    "declaredDebts",
    "adverseCredit",
    "currentAddress",
    "monthsAtCurrentAddress",
    "previousLandlordReference",
  ];
  for (const key of formKeys) {
    const value = submitted[key];
    if (value != null && value !== "") structuredData[key] = String(value);
  }

  return {
    intakeLinkId: row.id,
    applicantName: submitted.applicantName ?? row.applicant_name ?? "",
    propertyId: row.property_id,
    rentAmount: row.properties?.rent_amount ?? null,
    monthlyIncome: submitted.monthlyIncome ?? null,
    structuredData,
  };
}

/** Resolve a landlord review link (`/screen?intake=…`), including clear fail states. */
export async function resolveIntakeForReview(
  admin: SupabaseClient,
  userId: string,
  intakeLinkId: string,
): Promise<IntakeReviewLookup> {
  const { data } = await admin
    .from("intake_links")
    .select(
      "id, status, applicant_name, property_id, application_id, submitted_data, properties(rent_amount)",
    )
    .eq("id", intakeLinkId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    return {
      ok: false,
      reason: "not_found",
      message:
        "That applicant form wasn't found on your account. It may have been cancelled or the link is wrong.",
    };
  }

  const row = data as unknown as {
    id: string;
    status: IntakeLinkStatus;
    applicant_name: string | null;
    property_id: string | null;
    application_id: string | null;
    submitted_data: Partial<IntakeSubmission> | null;
    properties?: { rent_amount: number | null } | null;
  };

  if (row.status === "screened") {
    let assessmentId: string | null = null;
    if (row.application_id) {
      const { data: assessment } = await admin
        .from("assessments")
        .select("id")
        .eq("application_id", row.application_id)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      assessmentId = assessment?.id ?? null;
    }
    return {
      ok: false,
      reason: "already_screened",
      message:
        "This applicant form has already been screened. Open the report from your dashboard, or start a new screening.",
      assessmentId,
    };
  }

  if (row.status !== "submitted") {
    return {
      ok: false,
      reason: "not_ready",
      message:
        row.status === "pending"
          ? "The applicant hasn't submitted this form yet. Share the link and wait for their reply."
          : "This applicant form isn't available for review.",
    };
  }

  return { ok: true, source: mapSubmittedIntake(row) };
}

export async function getSubmittedIntakeForUser(
  admin: SupabaseClient,
  userId: string,
  intakeLinkId: string,
): Promise<IntakeSource | null> {
  const result = await resolveIntakeForReview(admin, userId, intakeLinkId);
  return result.ok ? result.source : null;
}
