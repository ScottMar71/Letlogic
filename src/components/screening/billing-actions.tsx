"use client";

import { useState } from "react";
import {
  createBillingPortal,
  createProSubscription,
} from "@/app/actions/billing";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function BillingActions({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);

  async function go(
    action: typeof createBillingPortal | typeof createProSubscription,
    key: string,
  ) {
    setLoading(key);
    setError(null);
    const result = await action();
    if (!result.ok) {
      setError(result.error);
      setLoading(null);
      return;
    }
    window.location.assign(result.url);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          disabled={loading !== null}
          onClick={() => setBuyOpen(true)}
        >
          Buy credits
        </Button>
        {!isPro ? (
          <Button
            variant="secondary"
            loading={loading === "pro"}
            disabled={loading !== null}
            onClick={() => go(createProSubscription, "pro")}
          >
            Upgrade to Pro
          </Button>
        ) : null}
        <Button
          variant="secondary"
          loading={loading === "portal"}
          disabled={loading !== null}
          onClick={() => go(createBillingPortal, "portal")}
        >
          Manage billing
        </Button>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      <BuyCreditsModal open={buyOpen} onClose={() => setBuyOpen(false)} />
    </div>
  );
}
