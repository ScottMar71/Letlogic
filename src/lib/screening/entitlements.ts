import type { SupabaseClient } from "@supabase/supabase-js";

/** True when the user has an active (or trialing) Pro subscription. */
export async function isPro(
  admin: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data } = await admin
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .limit(1);
  return (data?.length ?? 0) > 0;
}

/** True when the user has ever completed a multi-credit pack purchase. */
async function hasPackPurchase(
  admin: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "pack")
    .eq("status", "completed")
    .limit(1);
  return (data?.length ?? 0) > 0;
}

/** PDF export is included with any credit pack (5+) or an active Pro plan. */
export async function canExportPdf(
  admin: SupabaseClient,
  userId: string,
): Promise<boolean> {
  if (await isPro(admin, userId)) return true;
  return hasPackPurchase(admin, userId);
}
