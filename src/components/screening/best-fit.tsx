"use client";

import { useState } from "react";
import { compareApplicants, type ComparisonResult } from "@/app/actions/comparison";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";

export function BestFit({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function run() {
    setLoading(true);
    const r = await compareApplicants(propertyId);
    setLoading(false);
    setResult(r);
    if (!r.ok && r.code === "PRO_REQUIRED") setShowUpgrade(true);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-text">AI best-fit recommendation</p>
          <p className="text-sm text-text-subtle">
            Let AI weigh the trade-offs across applicants. Pro feature.
          </p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Analysing…" : "Find best fit"}
        </button>
      </div>

      {result?.ok && (
        <div className="mt-4 rounded-lg border border-success-border bg-success-bg p-4">
          <p className="font-medium text-success">
            Best fit: {result.bestApplicant}
          </p>
          <p className="mt-1 text-sm text-success">{result.rationale}</p>
        </div>
      )}

      {result && !result.ok && result.code !== "PRO_REQUIRED" && (
        <p className="mt-4 rounded-lg border border-danger-border bg-danger-bg p-3 text-sm text-danger">
          {result.error}
        </p>
      )}

      {result && !result.ok && result.code === "PRO_REQUIRED" && (
        <p className="mt-4 rounded-lg border border-warning-border bg-warning-bg p-3 text-sm text-warning">
          Comparison is a Pro feature.{" "}
          <button onClick={() => setShowUpgrade(true)} className="underline">
            Upgrade to Pro
          </button>
          .
        </p>
      )}

      <BuyCreditsModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
