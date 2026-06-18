"use client";

import { useEffect } from "react";
import { trackFunnel } from "@/lib/analytics/funnel";

type FunnelTrackerProps = {
  event: Parameters<typeof trackFunnel>[0];
};

export function FunnelTracker({ event }: FunnelTrackerProps) {
  useEffect(() => {
    trackFunnel(event);
  }, [event]);
  return null;
}
