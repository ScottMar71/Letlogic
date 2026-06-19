import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import {
  invoiceSubscriptionId,
  subscriptionPeriodEnd,
} from "./subscription-billing";

describe("invoiceSubscriptionId", () => {
  it("reads Basil parent.subscription_details", () => {
    const invoice = {
      parent: {
        type: "subscription_details",
        subscription_details: { subscription: "sub_basal_123" },
      },
    } as Stripe.Invoice;
    expect(invoiceSubscriptionId(invoice)).toBe("sub_basal_123");
  });

  it("reads legacy invoice.subscription", () => {
    const invoice = { subscription: "sub_legacy_456" } as Stripe.Invoice;
    expect(invoiceSubscriptionId(invoice)).toBe("sub_legacy_456");
  });

  it("reads line item subscription fallback", () => {
    const invoice = {
      lines: {
        data: [
          {
            parent: {
              subscription_item_details: { subscription: "sub_line_789" },
            },
          },
        ],
      },
    } as Stripe.Invoice;
    expect(invoiceSubscriptionId(invoice)).toBe("sub_line_789");
  });

  it("returns null when no subscription reference exists", () => {
    expect(invoiceSubscriptionId({} as Stripe.Invoice)).toBeNull();
  });
});

describe("subscriptionPeriodEnd", () => {
  it("reads subscription item current_period_end", () => {
    const sub = {
      items: { data: [{ current_period_end: 1_700_000_000 }] },
    } as Stripe.Subscription;
    expect(subscriptionPeriodEnd(sub)).toBe(
      new Date(1_700_000_000 * 1000).toISOString(),
    );
  });

  it("falls back to legacy subscription current_period_end", () => {
    const sub = {
      items: { data: [] },
      current_period_end: 1_800_000_000,
    } as unknown as Stripe.Subscription;
    expect(subscriptionPeriodEnd(sub)).toBe(
      new Date(1_800_000_000 * 1000).toISOString(),
    );
  });
});
