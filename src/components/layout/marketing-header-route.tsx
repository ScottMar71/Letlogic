"use client";

import { usePathname } from "next/navigation";
import {
  MarketingHeader,
  type MarketingHeaderProps,
} from "@/components/layout/marketing-header";

/** Per-route header overrides (pathname → partial props). */
const ROUTE_HEADER: Record<string, Partial<MarketingHeaderProps>> = {
  "/pricing": { showPricing: false },
  "/sample": { width: "narrow" },
};

export function MarketingHeaderRoute() {
  const pathname = usePathname();
  const overrides = ROUTE_HEADER[pathname] ?? {};
  return <MarketingHeader {...overrides} />;
}
