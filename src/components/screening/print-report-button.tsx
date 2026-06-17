"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintReportButton() {
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
