"use server";

import { randomBytes } from "node:crypto";
import { sendIntakeSubmittedEmail } from "@/lib/email/send-intake-submitted";
import { intakeSubmissionSchema } from "@/lib/screening/schema";
import { getPropertyForUser } from "@/lib/screening/queries";
import { captureServerError } from "@/lib/observability/sentry";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";

const TOKEN_PATTERN = /^[a-f0-9]{32}$/;

export type CreateIntakeLinkResult =
  | { ok: true; id: string; url: string }
  | { ok: false; error: string };

/** Landlord creates a shareable applicant form link. No credit is spent. */
export async function createIntakeLink(input?: {
  propertyId?: string;
}): Promise<CreateIntakeLinkResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in to create a link." };

  const admin = createAdminClient();

  if (input?.propertyId) {
    const property = await getPropertyForUser(admin, user.id, input.propertyId);
    if (!property) {
      return { ok: false, error: "That property was not found on your account." };
    }
  }

  const token = randomBytes(16).toString("hex");
  const { data, error } = await admin
    .from("intake_links")
    .insert({
      user_id: user.id,
      property_id: input?.propertyId ?? null,
      token,
    })
    .select("id")
    .single();

  if (error || !data) {
    captureServerError(error, { tags: { area: "intake", stage: "create" } });
    return { ok: false, error: "Could not create the link. Please try again." };
  }

  return { ok: true, id: data.id, url: `${site.url}/apply/${token}` };
}

export type CancelIntakeLinkResult = { ok: true } | { ok: false; error: string };

/** Landlord cancels a pending link so the applicant can no longer submit. */
export async function cancelIntakeLink(
  intakeLinkId: string,
): Promise<CancelIntakeLinkResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("intake_links")
    .update({ status: "cancelled" })
    .eq("id", intakeLinkId)
    .eq("user_id", user.id)
    .eq("status", "pending");

  if (error) {
    captureServerError(error, { tags: { area: "intake", stage: "cancel" } });
    return { ok: false, error: "Could not cancel the link." };
  }
  return { ok: true };
}

export type SubmitIntakeResult =
  | { ok: true }
  | {
      ok: false;
      code: "NOT_FOUND" | "EXPIRED" | "ALREADY_SUBMITTED" | "INVALID" | "FAILED";
      error: string;
    };

/** Applicant submits the public intake form. Unauthenticated by design. */
export async function submitIntakeApplication(
  token: string,
  rawInput: unknown,
): Promise<SubmitIntakeResult> {
  if (typeof token !== "string" || !TOKEN_PATTERN.test(token)) {
    return { ok: false, code: "NOT_FOUND", error: "This link isn't valid." };
  }

  const parsed = intakeSubmissionSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      error: parsed.error.issues[0]?.message ?? "Please check your answers.",
    };
  }

  const admin = createAdminClient();
  const { data: link } = await admin
    .from("intake_links")
    .select(
      "id, status, expires_at, user_id, properties(address_line1, city), profiles(email, full_name)",
    )
    .eq("token", token)
    .maybeSingle();

  if (!link || link.status === "cancelled") {
    return { ok: false, code: "NOT_FOUND", error: "This link isn't valid." };
  }
  if (link.status !== "pending") {
    return {
      ok: false,
      code: "ALREADY_SUBMITTED",
      error: "This application has already been submitted.",
    };
  }
  if (new Date(link.expires_at as string).getTime() < Date.now()) {
    return {
      ok: false,
      code: "EXPIRED",
      error: "This link has expired — please ask your landlord for a new one.",
    };
  }

  const { error } = await admin
    .from("intake_links")
    .update({
      applicant_name: parsed.data.applicantName,
      submitted_data: parsed.data,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", link.id)
    .eq("status", "pending");

  if (error) {
    captureServerError(error, { tags: { area: "intake", stage: "submit" } });
    return {
      ok: false,
      code: "FAILED",
      error: "We couldn't save your application. Please try again.",
    };
  }

  const row = link as unknown as {
    id: string;
    user_id: string;
    properties?: { address_line1: string; city: string } | null;
    profiles?: { email: string | null; full_name: string | null } | null;
  };
  const landlordEmail = row.profiles?.email?.trim();
  if (landlordEmail) {
    const property = row.properties;
    void sendIntakeSubmittedEmail({
      intakeLinkId: row.id,
      landlordEmail,
      landlordName: row.profiles?.full_name ?? null,
      applicantName: parsed.data.applicantName,
      propertyLabel: property
        ? `${property.address_line1}, ${property.city}`
        : null,
    });
  }

  return { ok: true };
}
