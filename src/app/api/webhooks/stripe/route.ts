import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderDocumentHtml } from "@/lib/documents/render";
import type { GeneratedDocument } from "@/lib/documents/types";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const documentId = session.metadata?.document_id;

  if (!userId || !documentId) return;

  const admin = createAdminClient();
  const editExpiresAt = new Date();
  editExpiresAt.setDate(editExpiresAt.getDate() + 30);

  const { data: purchase } = await admin
    .from("purchases")
    .update({
      status: "completed",
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
    })
    .eq("stripe_checkout_session_id", session.id)
    .select("id")
    .single();

  if (!purchase) return;

  const { data: doc } = await admin
    .from("documents")
    .select("generated_content")
    .eq("id", documentId)
    .single();

  const content = doc?.generated_content as GeneratedDocument | null;
  let finalStoragePath: string | null = null;

  if (content) {
    const html = renderDocumentHtml(content, { watermark: false });
    const path = `${userId}/${documentId}/final.html`;
    await admin.storage.from("documents").upload(path, html, {
      contentType: "text/html",
      upsert: true,
    });
    finalStoragePath = path;
  }

  await admin
    .from("documents")
    .update({
      status: "purchased",
      watermark: false,
      purchase_id: purchase.id,
      edit_expires_at: editExpiresAt.toISOString(),
      final_storage_path: finalStoragePath,
    })
    .eq("id", documentId)
    .eq("user_id", userId);
}
