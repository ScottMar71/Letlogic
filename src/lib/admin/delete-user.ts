import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due"] as const;

async function cancelActiveSubscriptions(
  admin: SupabaseClient,
  userId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: subscriptions, error } = await admin
    .from("subscriptions")
    .select("stripe_subscription_id, status")
    .eq("user_id", userId)
    .in("status", [...ACTIVE_SUBSCRIPTION_STATUSES]);

  if (error) {
    return { ok: false, error: "Could not load subscriptions." };
  }

  if (!subscriptions?.length) return { ok: true };

  const stripe = getStripe();
  for (const subscription of subscriptions) {
    try {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    } catch {
      return {
        ok: false,
        error: "Could not cancel the user's Stripe subscription.",
      };
    }
  }

  return { ok: true };
}

export async function deleteUserAccount(
  admin: SupabaseClient,
  userId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cancelResult = await cancelActiveSubscriptions(admin, userId);
  if (!cancelResult.ok) return cancelResult;

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    return { ok: false, error: "Could not delete user account." };
  }

  return { ok: true };
}
