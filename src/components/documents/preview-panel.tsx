"use client";

import type { GeneratedDocument } from "@/lib/documents/types";

type PreviewPanelProps = {
  html: string | null;
  document: GeneratedDocument | null;
  loading: boolean;
  error: string | null;
  priceLabel: string;
  onCheckout: () => void;
  checkoutLoading: boolean;
  isAuthenticated: boolean;
};

export function PreviewPanel({
  html,
  loading,
  error,
  priceLabel,
  onCheckout,
  checkoutLoading,
  isAuthenticated,
}: PreviewPanelProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
        Generating your document…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 text-sm">
        {error}
      </div>
    );
  }

  if (!html) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500 text-sm">
        Complete the form and click Generate preview to see your Section 21
        notice here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm">
        <iframe
          title="Document preview"
          srcDoc={html}
          className="w-full min-h-[520px] border-0"
          sandbox=""
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-xl border border-zinc-200 bg-white p-4">
        <div>
          <p className="font-medium text-zinc-900">Download this document</p>
          <p className="text-sm text-zinc-600">
            {priceLabel} · PDF-ready HTML · 30-day re-edit
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-amber-700 mt-1">
              Sign in required before payment.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCheckout}
          disabled={checkoutLoading}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {checkoutLoading
            ? "Redirecting…"
            : isAuthenticated
              ? `Download for ${priceLabel}`
              : "Sign in & download"}
        </button>
      </div>
    </div>
  );
}
