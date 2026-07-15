"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnlockPdfModal } from "@/components/screening/unlock-pdf-modal";

type PrintReportButtonProps = {
  /** PDF export is included with any multi-credit pack (5+) or Pro. */
  canExport: boolean;
  /** When unlocking from a report, return here after checkout. */
  assessmentId?: string;
};

export function PrintReportButton({
  canExport,
  assessmentId,
}: PrintReportButtonProps) {
  const [showUnlock, setShowUnlock] = useState(false);
  const returnPath = assessmentId ? `/screenings/${assessmentId}` : undefined;

  if (!canExport) {
    return (
      <>
        <Button
          variant="secondary"
          className="no-print"
          onClick={() => setShowUnlock(true)}
        >
          <Printer className="h-4 w-4" aria-hidden />
          Export PDF
        </Button>
        <UnlockPdfModal
          open={showUnlock}
          onClose={() => setShowUnlock(false)}
          returnPath={returnPath}
        />
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
