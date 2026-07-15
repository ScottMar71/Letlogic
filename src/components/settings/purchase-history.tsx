"use client";

import { useState } from "react";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";
import { StatusBadge, PURCHASE_STATUS_LABELS } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format-date";
import { formatGbp } from "@/lib/screening/pricing";

type Purchase = {
  id: string;
  amount_pence: number;
  credits_total: number;
  status: string;
  created_at: string;
};

export function PurchaseHistory({ purchases }: { purchases: Purchase[] }) {
  const [buyOpen, setBuyOpen] = useState(false);

  if (purchases.length === 0) {
    return (
      <>
        <div className="rounded-xl border border-dashed border-border-strong bg-surface p-8 text-center">
          <p className="font-medium text-text">No purchases yet</p>
          <p className="mt-1 text-sm text-text-subtle">
            Your credit pack and subscription purchases will appear here.
          </p>
          <button
            type="button"
            onClick={() => setBuyOpen(true)}
            className="btn-primary mt-4"
          >
            Buy credits
          </button>
        </div>
        <BuyCreditsModal open={buyOpen} onClose={() => setBuyOpen(false)} />
      </>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {purchases.map((p) => {
        const statusInfo =
          PURCHASE_STATUS_LABELS[p.status] ?? {
            label: p.status,
            variant: "neutral" as const,
          };
        return (
          <li
            key={p.id}
            className="flex items-center justify-between px-4 py-3 text-sm"
          >
            <div>
              <p className="text-text">
                {p.credits_total} credit{p.credits_total === 1 ? "" : "s"}
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-text-subtle">
                {formatDate(p.created_at)}
                <StatusBadge variant={statusInfo.variant}>
                  {statusInfo.label}
                </StatusBadge>
              </p>
            </div>
            <span className="font-medium text-text">
              {formatGbp(p.amount_pence)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
