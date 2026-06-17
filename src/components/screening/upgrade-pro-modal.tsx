"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { createProSubscription } from "@/app/actions/billing";
import { PRO_PLAN, formatGbp } from "@/lib/screening/pricing";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const PRO_FEATURES = [
  `${PRO_PLAN.monthlyCredits} screenings per month`,
  "Side-by-side applicant comparison",
  "AI best-fit recommendation",
  "PDF export",
];

type UpgradeProModalProps = {
  open: boolean;
  onClose: () => void;
};

export function UpgradeProModal({ open, onClose }: UpgradeProModalProps) {
  const [loading, setLoading] = useState(false);
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

  async function upgrade() {
    setLoading(true);
    setError(null);
    const result = await createProSubscription();
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
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
        aria-labelledby="upgrade-pro-title"
        className="w-full max-w-md space-y-5 rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="upgrade-pro-title" className="text-lg font-semibold text-text">
              Upgrade to {PRO_PLAN.name}
            </h2>
            <p className="text-sm text-text-muted">
              Unlock comparison tools and unlimited monthly screenings.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-subtle hover:bg-surface-muted"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <ul className="space-y-2 text-sm text-text-muted">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-success" aria-hidden>✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between rounded-xl border border-brand-700 bg-brand-700 p-4 text-white">
          <span className="text-2xl font-bold">
            {formatGbp(PRO_PLAN.pricePence)}
            <span className="text-base font-normal text-brand-100">/mo</span>
          </span>
          <Button variant="onbrand" loading={loading} onClick={upgrade}>
            Upgrade now
          </Button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </div>
  );
}
