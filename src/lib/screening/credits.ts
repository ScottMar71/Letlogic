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
  const { data, error } = await admin.rpc("get_credit_balance", {
    p_user_id: userId,
  });
  if (error || data == null) return 0;
  return data as number;
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
  stripeInvoiceId?: string,
): Promise<void> {
  const { error } = await admin.from("credit_ledger").insert({
    user_id: userId,
    delta: amount,
    reason,
    purchase_id: purchaseId ?? null,
    stripe_invoice_id: stripeInvoiceId ?? null,
  });
  // Unique stripe_invoice_id makes Pro grants idempotent across webhook retries.
  if (error?.code === "23505" && stripeInvoiceId) return;
  if (error) throw error;
}
