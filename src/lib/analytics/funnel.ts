"use client";

import { track } from "@vercel/analytics";

type FunnelEvent =
  | "sample_viewed"
  | "pricing_viewed"
  | "screen_started"
  | "checkout_started";

export function trackFunnel(event: FunnelEvent) {
  track(event);
}
