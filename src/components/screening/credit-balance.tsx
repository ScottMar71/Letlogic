"use client";

import { useState } from "react";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";

type CreditBalanceProps = {
  balance: number;
  /** Show the Buy credits control (header/nav). Settings uses BillingActions instead. */
  showBuy?: boolean;
};

export function CreditBalance({
  balance,
  showBuy = true,
}: CreditBalanceProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-text-muted">
          <span className="font-semibold text-text">{balance}</span> credit
          {balance === 1 ? "" : "s"}
        </span>
        {showBuy ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-9 items-center rounded-lg border border-border-strong px-3 font-medium text-text transition-colors hover:border-brand-600 hover:text-brand-ink"
          >
            Buy credits
          </button>
        ) : null}
      </div>
      {showBuy ? (
        <BuyCreditsModal open={open} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
