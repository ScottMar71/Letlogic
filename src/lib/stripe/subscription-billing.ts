import type Stripe from "stripe";

function stripeExpandableId(
  value: string | { id: string } | null | undefined,
): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/** Subscription id on an invoice (Basil+ moved off `invoice.subscription`). */
export function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const parent = invoice.parent;
  if (parent?.type === "subscription_details") {
    const sub = stripeExpandableId(parent.subscription_details?.subscription);
    if (sub) return sub;
  }

  const legacy = (invoice as { subscription?: string | { id: string } | null })
    .subscription;
  const legacySub = stripeExpandableId(legacy);
  if (legacySub) return legacySub;

  const lineSub =
    invoice.lines?.data?.[0]?.parent?.subscription_item_details?.subscription;
  return stripeExpandableId(lineSub as string | { id: string } | null | undefined);
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
