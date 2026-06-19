import type Stripe from "stripe";

/** Subscription id on an invoice (Basil+ moved off `invoice.subscription`). */
export function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const parent = invoice.parent;
  if (parent?.type === "subscription_details") {
    const sub = parent.subscription_details?.subscription;
    if (sub) return typeof sub === "string" ? sub : sub.id;
  }

  const legacy = (invoice as { subscription?: string | { id: string } | null })
    .subscription;
  if (legacy) return typeof legacy === "string" ? legacy : legacy.id;

  const lineSub =
    invoice.lines?.data?.[0]?.parent?.subscription_item_details?.subscription;
  if (lineSub) return typeof lineSub === "string" ? lineSub : lineSub.id;

  return null;
}

/** Billing period end for idempotency (Basil+ uses subscription item periods). */
export function subscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  const itemEnd = sub.items?.data?.[0]?.current_period_end;
  if (typeof itemEnd === "number") {
    return new Date(itemEnd * 1000).toISOString();
  }

  const legacy = (sub as { current_period_end?: number }).current_period_end;
  if (typeof legacy === "number") {
    return new Date(legacy * 1000).toISOString();
  }

  return null;
}
