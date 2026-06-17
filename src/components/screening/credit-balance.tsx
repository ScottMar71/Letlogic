"use client";

import { useState } from "react";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";

export function CreditBalance({ balance }: { balance: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-text-muted">
          <span className="font-semibold text-text">{balance}</span> credit
          {balance === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-9 items-center rounded-lg border border-border-strong px-3 font-medium text-text transition-colors hover:border-brand-600 hover:text-brand-700"
        >
          Buy credits
        </button>
      </div>
      <BuyCreditsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
