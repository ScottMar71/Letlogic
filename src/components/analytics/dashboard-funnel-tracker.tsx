"use client";

import { useEffect } from "react";
import { trackFunnel } from "@/lib/analytics/funnel";

export function DashboardFunnelTracker() {
  useEffect(() => {
    trackFunnel("dashboard_viewed");
  }, []);
  return null;
}
