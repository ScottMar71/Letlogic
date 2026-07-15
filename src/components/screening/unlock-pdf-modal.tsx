"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
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
import { trackFunnel } from "@/lib/analytics/funnel";
import { Alert } from "@/components/ui/alert";
import { useDialogFocus } from "@/hooks/use-dialog-focus";

const PDF_PACKS = CREDIT_PACK_LIST.filter((pack) => pack.includesPdfExport);

type UnlockPdfModalProps = {
  open: boolean;
  onClose: () => void;
  /** Return to this report after checkout (e.g. `/screenings/{id}`). */
  returnPath?: string;
};

export function UnlockPdfModal({
  open,
  onClose,
  returnPath,
}: UnlockPdfModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, onClose, dialogRef);

  if (!open) return null;

  async function buyPack(pack: CreditPack) {
    setLoading(pack.slug);
    setError(null);
    const result = await createCreditCheckout(pack.slug, { returnPath });
    if (!result.ok) {
      setError(result.error);
      setLoading(null);
      return;
    }
    trackFunnel("pdf_unlock_checkout_started");
    window.location.assign(result.url);
  }

  async function goPro() {
    setLoading("pro");
    setError(null);
    const result = await createProSubscription({ returnPath });
    if (!result.ok) {
      setError(result.error);
      setLoading(null);
      return;
    }
    trackFunnel("pdf_unlock_checkout_started");
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
        aria-labelledby="unlock-pdf-title"
        className="w-full max-w-lg space-y-5 rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="unlock-pdf-title" className="text-lg font-semibold text-text">
              Unlock PDF export
            </h2>
            <p className="text-sm text-text-muted">
              Included with multi-credit packs (5+) — buy once and PDF export
              stays unlocked on your account. Also included with Pro. Not
              included with a single screening.
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

        <div className="space-y-3">
          {PDF_PACKS.map((pack) => (
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
                  {formatGbp(unitPricePence(pack))} per screening · PDF export
                  included
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

        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </div>
  );
}
