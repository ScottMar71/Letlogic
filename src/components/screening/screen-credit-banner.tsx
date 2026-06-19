"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";
import { formatGbp, unitPricePence, CREDIT_PACKS } from "@/lib/screening/pricing";

type ScreenCreditBannerProps = {
  balance: number;
};

export function ScreenCreditBanner({ balance }: ScreenCreditBannerProps) {
  const [open, setOpen] = useState(false);

  if (balance > 0) return null;

  const fromPrice = formatGbp(unitPricePence(CREDIT_PACKS.single));

  return (
    <>
      <Alert variant="warning" title="Buy a credit to screen">
        <p>
          Each screening uses one credit. Purchase a pack from {fromPrice} to
          analyse your first applicant — or upgrade to Pro for monthly credits.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary mt-3"
        >
          Buy credits
        </button>
      </Alert>
      <BuyCreditsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
