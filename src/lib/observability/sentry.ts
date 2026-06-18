import * as Sentry from "@sentry/nextjs";

type CaptureContext = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

/** Report a server-side error to Sentry when configured. No-op without DSN. */
export function captureServerError(
  error: unknown,
  context?: CaptureContext,
): void {
  if (!process.env.SENTRY_DSN) return;
  Sentry.captureException(error, context);
}
