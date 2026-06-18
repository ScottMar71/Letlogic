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

export function PricingCta({ pack, isAuthenticated }: PricingCtaProps) {
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
        variant="secondary"
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
}: {
  pack: CreditPack;
  isAuthenticated: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 text-center">
      <p className="font-semibold text-text">{pack.name}</p>
      <p className="mt-2 text-3xl font-bold text-text">
        {formatGbp(pack.pricePence)}
      </p>
      <p className="mt-1 text-sm text-text-subtle">
        {formatGbp(unitPricePence(pack))} per screening
      </p>
      <PricingCta pack={pack} isAuthenticated={isAuthenticated} />
    </div>
  );
}
