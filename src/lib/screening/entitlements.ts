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
