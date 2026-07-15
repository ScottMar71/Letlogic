"use server";

import { getCreditPack, PRO_PLAN } from "@/lib/screening/pricing";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/request-origin";
import { site } from "@/lib/site";
import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

async function getOrCreateCustomer(
  stripe: Stripe,
  admin: SupabaseClient,
  userId: string,
  email?: string,
): Promise<string> {
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  });
  await admin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);
  return customer.id;
}

export async function createCreditCheckout(
  packSlug: string,
  options?: { returnPath?: string },
): Promise<CheckoutResult> {
  const pack = getCreditPack(packSlug);
  if (!pack) return { ok: false, error: "Unknown credit pack." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in to buy credits." };

  const admin = createAdminClient();
  const stripe = getStripe();
  const customerId = await getOrCreateCustomer(stripe, admin, user.id, user.email);

  const successPath = options?.returnPath
    ? safeNextPath(options.returnPath)
    : "/dashboard";
  const successSeparator = successPath.includes("?") ? "&" : "?";
  const success_url = `${site.url}${successPath}${successSeparator}credits=success`;
  const cancel_url = options?.returnPath
    ? `${site.url}${successPath}${successSeparator}cancelled=1`
    : `${site.url}/pricing?cancelled=1`;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: pack.pricePence,
          product_data: {
            name: `LetLogic — ${pack.name}`,
            description: `${pack.credits} screening credit${pack.credits > 1 ? "s" : ""}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      purchase_type: "credits",
      pack_slug: pack.slug,
      credits: String(pack.credits),
    },
    success_url,
    cancel_url,
  });

  if (!session.url) return { ok: false, error: "Could not start checkout." };

  await admin.from("purchases").insert({
    user_id: user.id,
    stripe_checkout_session_id: session.id,
    type: pack.purchaseType,
    pack_slug: pack.slug,
    amount_pence: pack.pricePence,
    credits_total: pack.credits,
    status: "pending",
  });

  return { ok: true, url: session.url };
}

export async function createBillingPortal(): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in." };

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return { ok: false, error: "No billing account yet — buy credits or go Pro first." };
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${site.url}/settings`,
  });
  return { ok: true, url: session.url };
}

export async function createProSubscription(
  options?: { returnPath?: string },
): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in to upgrade." };

  const admin = createAdminClient();
  const stripe = getStripe();
  const customerId = await getOrCreateCustomer(stripe, admin, user.id, user.email);

  const successPath = options?.returnPath
    ? safeNextPath(options.returnPath)
    : "/settings";
  const successSeparator = successPath.includes("?") ? "&" : "?";
  const success_url = `${site.url}${successPath}${successSeparator}pro=success`;
  const cancel_url = options?.returnPath
    ? `${site.url}${successPath}${successSeparator}cancelled=1`
    : `${site.url}/pricing?cancelled=1`;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: PRO_PLAN.pricePence,
          recurring: { interval: "month" },
          product_data: {
            name: "LetLogic Pro",
            description: `${PRO_PLAN.monthlyCredits} screenings/month, comparison view, PDF export`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      purchase_type: "subscription",
      monthly_credits: String(PRO_PLAN.monthlyCredits),
    },
    success_url,
    cancel_url,
  });

  if (!session.url) return { ok: false, error: "Could not start checkout." };
  return { ok: true, url: session.url };
}
