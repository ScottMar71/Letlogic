// Single source of truth for tenant-screening pricing (GBP, pence).
// Consumed by the checkout actions (T8/T9) and the pricing/billing UI (T11/T16/T17).
// No free checks: every real screening costs one credit.

export type CreditPackSlug = "single" | "pack5" | "pack20";

export type CreditPack = {
  slug: CreditPackSlug;
  name: string;
  /** Total price charged for the pack, in pence. */
  pricePence: number;
  /** Number of screening credits granted on purchase. */
  credits: number;
  /** Stripe purchase type recorded on the purchases row. */
  purchaseType: "single_doc" | "pack";
};

export const CREDIT_PACKS: Record<CreditPackSlug, CreditPack> = {
  single: {
    slug: "single",
    name: "Single screening",
    pricePence: 499,
    credits: 1,
    purchaseType: "single_doc",
  },
  pack5: {
    slug: "pack5",
    name: "5 screenings",
    pricePence: 1999,
    credits: 5,
    purchaseType: "pack",
  },
  pack20: {
    slug: "pack20",
    name: "20 screenings",
    pricePence: 5999,
    credits: 20,
    purchaseType: "pack",
  },
};

export const CREDIT_PACK_LIST: CreditPack[] = [
  CREDIT_PACKS.single,
  CREDIT_PACKS.pack5,
  CREDIT_PACKS.pack20,
];

export type ProPlan = {
  slug: "pro";
  name: string;
  /** Recurring monthly price, in pence. */
  pricePence: number;
  /** Credits granted at the start of each billing period. */
  monthlyCredits: number;
  /** Price per screening once the monthly allowance is used, in pence. */
  overagePencePerCredit: number;
};

export const PRO_PLAN: ProPlan = {
  slug: "pro",
  name: "Pro",
  pricePence: 2900,
  monthlyCredits: 15,
  overagePencePerCredit: 200,
};

export function getCreditPack(slug: string): CreditPack | undefined {
  return (CREDIT_PACKS as Record<string, CreditPack>)[slug];
}

/** Format a pence amount as a GBP string, e.g. 499 -> "£4.99". */
export function formatGbp(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

/** Per-credit unit price for a pack, in pence (for "£4.00/check" style copy). */
export function unitPricePence(pack: CreditPack): number {
  return Math.round(pack.pricePence / pack.credits);
}
