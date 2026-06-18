"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { UpgradeProModal } from "@/components/screening/upgrade-pro-modal";
import { PRO_PLAN } from "@/lib/screening/pricing";

export function ProCompareGate() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <Card className="max-w-lg space-y-4">
        <h2 className="text-lg font-semibold text-text">Pro feature</h2>
        <p className="text-sm text-text-muted">
          Side-by-side applicant comparison and AI best-fit recommendations are
          included on Pro ({PRO_PLAN.monthlyCredits} screenings/month).
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowUpgrade(true)}
          >
            Upgrade to Pro
          </button>
          <Link href="/settings" className="btn-secondary">
            View billing
          </Link>
        </div>
      </Card>
      <UpgradeProModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
