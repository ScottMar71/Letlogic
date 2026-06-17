import type { SupabaseClient } from "@supabase/supabase-js";

export type CreditLedgerReason =
  | "purchase"
  | "screening_spend"
  | "screening_refund"
  | "pro_grant"
  | "adjustment";

/** Current credit balance for a user = sum(delta) over the ledger. */
export async function getCreditBalance(
  admin: SupabaseClient,
  userId: string,
): Promise<number> {
  const { data, error } = await admin
    .from("credit_ledger")
    .select("delta")
    .eq("user_id", userId);

  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + (row.delta ?? 0), 0);
}

/** Atomically debit one credit. Returns the ledger row id, or null if broke. */
export async function spendCredit(
  admin: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data, error } = await admin.rpc("spend_credit", {
    p_user_id: userId,
  });
  if (error) return null;
  return (data as string | null) ?? null;
}

/** Refund a previously-spent credit (e.g. when generation fails). */
export async function refundCredit(
  admin: SupabaseClient,
  userId: string,
  assessmentId?: string,
): Promise<void> {
  await admin.from("credit_ledger").insert({
    user_id: userId,
    delta: 1,
    reason: "screening_refund" satisfies CreditLedgerReason,
    assessment_id: assessmentId ?? null,
  });
}

/** Grant credits (purchase or Pro period). Idempotent callers should check first. */
export async function grantCredits(
  admin: SupabaseClient,
  userId: string,
  amount: number,
  reason: Extract<CreditLedgerReason, "purchase" | "pro_grant" | "adjustment">,
  purchaseId?: string,
): Promise<void> {
  await admin.from("credit_ledger").insert({
    user_id: userId,
    delta: amount,
    reason,
    purchase_id: purchaseId ?? null,
  });
}
