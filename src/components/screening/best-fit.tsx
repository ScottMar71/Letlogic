"use client";

import { useState } from "react";
import { compareApplicants, type ComparisonResult } from "@/app/actions/comparison";
import { UpgradeProModal } from "@/components/screening/upgrade-pro-modal";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
        <Button loading={loading} onClick={run}>
          Find best fit
        </Button>
      </div>

      {result?.ok && (
        <Alert variant="success" className="mt-4">
          <p className="font-medium">Best fit: {result.bestApplicant}</p>
          <p className="mt-1">{result.rationale}</p>
        </Alert>
      )}

      {result && !result.ok && result.code !== "PRO_REQUIRED" && (
        <Alert variant="error" className="mt-4">
          {result.error}
        </Alert>
      )}

      {result && !result.ok && result.code === "PRO_REQUIRED" && (
        <Alert variant="warning" className="mt-4">
          Comparison is a Pro feature.{" "}
          <button
            type="button"
            onClick={() => setShowUpgrade(true)}
            className="font-medium underline"
          >
            Upgrade to Pro
          </button>
          .
        </Alert>
      )}

      <UpgradeProModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
