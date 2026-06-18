"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeProModal } from "@/components/screening/upgrade-pro-modal";

type PrintReportButtonProps = {
  isPro: boolean;
};

export function PrintReportButton({ isPro }: PrintReportButtonProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!isPro) {
    return (
      <>
        <Button
          variant="secondary"
          className="no-print"
          onClick={() => setShowUpgrade(true)}
        >
          <Printer className="h-4 w-4" aria-hidden />
          Export PDF (Pro)
        </Button>
        <UpgradeProModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      </>
    );
  }

  return (
    <Button
      variant="secondary"
      className="no-print"
      onClick={() => window.print()}
    >
      <Printer className="h-4 w-4" aria-hidden />
      Print / Save PDF
    </Button>
  );
}
