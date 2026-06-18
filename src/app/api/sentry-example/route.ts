import { NextResponse } from "next/server";
import { captureServerError } from "@/lib/observability/sentry";

/** Throws a test error to verify Sentry is wired. Hit only in staging/debug. */
export async function GET() {
  const err = new Error("LetLogic Sentry test error");
  captureServerError(err, { tags: { area: "sentry-example" } });
  return NextResponse.json(
    { ok: false, message: "Test error sent to Sentry (if DSN is configured)." },
    { status: 500 },
  );
}
