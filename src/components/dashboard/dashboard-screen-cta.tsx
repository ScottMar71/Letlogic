"use client";

import { useState } from "react";
import Link from "next/link";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";

type DashboardScreenCtaProps = {
  balance: number;
};

export function DashboardScreenCta({ balance }: DashboardScreenCtaProps) {
  const [open, setOpen] = useState(false);

  if (balance === 0) {
    return (
      <>
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">
          Buy credits to screen
        </button>
        <BuyCreditsModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <Link href="/screen" className="btn-primary">
      New screening
    </Link>
  );
}
