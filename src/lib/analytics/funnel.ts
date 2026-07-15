import { track } from "@vercel/analytics";

type FunnelEvent =
  | "sample_viewed"
  | "pricing_viewed"
  | "screen_started"
  | "checkout_started"
  | "signup_completed"
  | "dashboard_viewed"
  | "first_screen_complete"
  | "intake_link_created"
  | "pdf_unlock_checkout_started";

export function trackFunnel(event: FunnelEvent) {
  track(event);
}
