"use client";

import { useEffect, useRef, useState } from "react";
import {
  createCreditCheckout,
  createProSubscription,
} from "@/app/actions/billing";
import {
  CREDIT_PACK_LIST,
  PRO_PLAN,
  formatGbp,
  unitPricePence,
  type CreditPack,
} from "@/lib/screening/pricing";

type BuyCreditsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BuyCreditsModal({ open, onClose }: BuyCreditsModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const node = dialogRef.current;
    const focusables = node?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusables?.[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  async function buyPack(pack: CreditPack) {
    setLoading(pack.slug);
    setError(null);
    const result = await createCreditCheckout(pack.slug);
    if (!result.ok) {
      setError(result.error);
      setLoading(null);
      return;
    }
    window.location.assign(result.url);
  }

  async function goPro() {
    setLoading("pro");
    setError(null);
    const result = await createProSubscription();
    if (!result.ok) {
      setError(result.error);
      setLoading(null);
      return;
    }
    window.location.assign(result.url);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="buy-credits-title"
        className="w-full max-w-lg space-y-5 rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="buy-credits-title" className="text-lg font-semibold text-text">
              Buy screening credits
            </h2>
            <p className="text-sm text-text-muted">
              Each screening uses one credit. No subscription required.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-subtle hover:bg-surface-muted hover:text-text"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {CREDIT_PACK_LIST.map((pack) => (
            <button
              key={pack.slug}
              type="button"
              disabled={loading !== null}
              onClick={() => buyPack(pack)}
              className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left transition-colors hover:border-brand-600 disabled:opacity-60"
            >
              <div>
                <p className="font-medium text-text">{pack.name}</p>
                <p className="text-sm text-text-subtle">
                  {formatGbp(unitPricePence(pack))} per screening
                </p>
              </div>
              <span className="font-semibold text-text">
                {loading === pack.slug ? "…" : formatGbp(pack.pricePence)}
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-brand-700 bg-brand-700 p-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{PRO_PLAN.name}</p>
              <p className="text-sm text-brand-100">
                {PRO_PLAN.monthlyCredits} screenings/mo · comparison · PDF export
              </p>
            </div>
            <button
              type="button"
              disabled={loading !== null}
              onClick={goPro}
              className="btn-onbrand shrink-0"
            >
              {loading === "pro" ? "…" : `${formatGbp(PRO_PLAN.pricePence)}/mo`}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-danger-border bg-danger-bg p-3 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
