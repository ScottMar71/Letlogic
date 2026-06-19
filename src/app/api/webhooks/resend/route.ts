import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { getContactInboxEmail } from "@/lib/contact/inbox";
import { site } from "@/lib/site";
import { captureServerError } from "@/lib/observability/sentry";

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!webhookSecret || !apiKey) {
    console.error("[resend-webhook] Missing RESEND_WEBHOOK_SECRET or RESEND_API_KEY");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const payload = await request.text();
  const headerList = await headers();
  const resend = new Resend(apiKey);

  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: headerList.get("svix-id") ?? "",
        timestamp: headerList.get("svix-timestamp") ?? "",
        signature: headerList.get("svix-signature") ?? "",
      },
      webhookSecret,
    });
  } catch (err) {
    captureServerError(err, { tags: { area: "resend", event: "verify" } });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true });
  }

  const emailId = event.data.email_id;
  if (!emailId) {
    return NextResponse.json({ error: "Missing email_id" }, { status: 400 });
  }

  try {
    const { error } = await resend.emails.receiving.forward({
      emailId,
      to: getContactInboxEmail(),
      from: `${site.name} <noreply@${site.domain}>`,
      passthrough: true,
    });

    if (error) {
      console.error("[resend-webhook] Forward failed:", error.message);
      captureServerError(new Error(error.message), {
        tags: { area: "resend", event: "email.received" },
        extra: { emailId },
      });
      return NextResponse.json({ error: "Forward failed" }, { status: 500 });
    }
  } catch (err) {
    captureServerError(err, {
      tags: { area: "resend", event: "email.received" },
      extra: { emailId },
    });
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
