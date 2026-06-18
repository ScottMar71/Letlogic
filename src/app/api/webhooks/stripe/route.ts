import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { grantCredits } from "@/lib/screening/credits";
import { PRO_PLAN } from "@/lib/screening/pricing";
import { captureServerError } from "@/lib/observability/sentry";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    } catch (err) {
      captureServerError(err, {
        tags: { area: "stripe", event: "checkout.session.completed" },
      });
      return NextResponse.json({ error: "Handler failed" }, { status: 500 });
    }
  } else if (event.type === "invoice.paid") {
    try {
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
    } catch (err) {
      captureServerError(err, {
        tags: { area: "stripe", event: "invoice.paid" },
      });
      return NextResponse.json({ error: "Handler failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const admin = createAdminClient();
  const purchaseType = session.metadata?.purchase_type;

  if (purchaseType === "credits") {
    await handleCreditsPurchase(admin, session);
    return;
  }
  if (purchaseType === "subscription") {
    await handleSubscriptionStart(admin, session);
    return;
  }
}

async function handleCreditsPurchase(
  admin: SupabaseClient,
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.user_id;
  if (!userId) return;

  const { data: purchase } = await admin
    .from("purchases")
    .update({
      status: "completed",
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
    })
    .eq("stripe_checkout_session_id", session.id)
    .select("id, credits_total")
    .single();

  if (!purchase) return;

  // Idempotency: only grant once per purchase, even if the webhook retries.
  const { count } = await admin
    .from("credit_ledger")
    .select("id", { count: "exact", head: true })
    .eq("purchase_id", purchase.id)
    .eq("reason", "purchase");

  if ((count ?? 0) > 0) return;

  await grantCredits(admin, userId, purchase.credits_total, "purchase", purchase.id);
}

async function handleSubscriptionStart(
  admin: SupabaseClient,
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.user_id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  if (!userId || !subscriptionId) return;

  // Upsert the subscription record with a null period end. Credit grants happen
  // in invoice.paid (which Stripe also fires for the first payment); the null
  // period end ensures that first invoice grants the opening month's credits.
  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      status: "active",
      current_period_end: null,
    },
    { onConflict: "stripe_subscription_id" },
  );
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (!profile) return;

  const subId = invoiceSubscriptionId(invoice);
  if (!subId) return;

  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(subId);
  const newPeriodEnd = subscriptionPeriodEnd(sub);

  const { data: existing } = await admin
    .from("subscriptions")
    .select("current_period_end")
    .eq("stripe_subscription_id", subId)
    .single();

  // Idempotency / no double-grant: only advance + grant when the billing
  // period actually moves forward.
  if (
    existing?.current_period_end &&
    newPeriodEnd &&
    new Date(newPeriodEnd) <= new Date(existing.current_period_end)
  ) {
    return;
  }

  await admin
    .from("subscriptions")
    .update({ status: "active", current_period_end: newPeriodEnd })
    .eq("stripe_subscription_id", subId);

  await grantCredits(
    admin,
    profile.id,
    PRO_PLAN.monthlyCredits,
    "pro_grant",
    undefined,
    invoice.id,
  );
}

function subscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  const end = (sub as unknown as { current_period_end?: number })
    .current_period_end;
  return typeof end === "number" ? new Date(end * 1000).toISOString() : null;
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = (invoice as unknown as { subscription?: string | { id: string } })
    .subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}
