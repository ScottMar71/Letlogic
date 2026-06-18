"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Coins } from "lucide-react";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";

type CreditAlertBannerProps = {
  balance: number;
};

export function CreditAlertBanner({ balance }: CreditAlertBannerProps) {
  const [open, setOpen] = useState(false);

  if (balance > 2) return null;

  const isEmpty = balance === 0;

  return (
    <>
      <div
        className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-3.5 ${
          isEmpty
            ? "border-danger-border bg-danger-bg"
            : "border-warning-border bg-warning-bg"
        }`}
        role="status"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface ${
              isEmpty ? "text-danger" : "text-warning"
            }`}
            aria-hidden
          >
            {isEmpty ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Coins className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-text">
              {isEmpty ? "You’re out of credits" : "Credits running low"}
            </p>
            <p className="mt-0.5 text-sm text-text-muted">
              {isEmpty
                ? "Top up to screen your next applicant. Each screening uses one credit."
                : `You have ${balance} credit${balance === 1 ? "" : "s"} left — top up before your next screening.`}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn-primary min-h-9 px-3 py-1.5 text-sm"
          >
            Buy credits
          </button>
          <Link href="/settings" className="btn-secondary min-h-9 px-3 py-1.5 text-sm">
            Billing
          </Link>
        </div>
      </div>
      <BuyCreditsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
