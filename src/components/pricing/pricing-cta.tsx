"use client";

import { useState } from "react";
import { createCreditCheckout } from "@/app/actions/billing";
import { formatGbp, unitPricePence, type CreditPack } from "@/lib/screening/pricing";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

type PricingCtaProps = {
  pack: CreditPack;
  isAuthenticated: boolean;
};

function PricingCta({ pack, isAuthenticated }: PricingCtaProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <a
        href={`/login?next=${encodeURIComponent("/pricing")}`}
        className="btn-primary mt-4 w-full"
      >
        Sign in to buy
      </a>
    );
  }

  async function buy() {
    setLoading(true);
    setError(null);
    const result = await createCreditCheckout(pack.slug);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    window.location.assign(result.url);
  }

  return (
    <div className="mt-4">
      <Button
        variant="primary"
        className="w-full"
        loading={loading}
        onClick={buy}
      >
        Buy {pack.name}
      </Button>
      {error && (
        <Alert variant="error" className="mt-2">
          {error}
        </Alert>
      )}
    </div>
  );
}

export function PricingPackCard({
  pack,
  isAuthenticated,
  featured = false,
}: {
  pack: CreditPack;
  isAuthenticated: boolean;
  featured?: boolean;
}) {
  const features = [
    "Full AI screening report",
    "Applicant intake link — they fill in the form",
    ...(pack.includesPdfExport ? ["PDF export included"] : []),
    "Credits never expire",
  ];

  return (
    <div
      className={`relative rounded-2xl border bg-surface p-6 text-center ${
        featured
          ? "border-brand-600 ring-1 ring-brand-600"
          : "border-border"
      }`}
    >
      {featured ? (
        <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-text-on-teal">
          Most popular
        </p>
      ) : null}
      <p className="font-semibold text-text">{pack.name}</p>
      <p className="mt-2 text-3xl font-bold text-text">
        {formatGbp(pack.pricePence)}
      </p>
      <p className="mt-1 text-sm text-text-subtle">
        {formatGbp(unitPricePence(pack))} per screening
      </p>
      <ul className="mt-4 space-y-1.5 text-left text-sm text-text-muted">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="text-success" aria-hidden>
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <PricingCta pack={pack} isAuthenticated={isAuthenticated} />
    </div>
  );
}
