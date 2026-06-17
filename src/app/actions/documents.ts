"use server";

import { generateDocument } from "@/lib/ai/generate-document";
import { buildSection21Prompt } from "@/lib/documents/section-21/prompt";
import {
  section21Schema,
  type Section21FormData,
} from "@/lib/documents/section-21/schema";
import { renderDocumentHtml } from "@/lib/documents/render";
import type { GeneratedDocument } from "@/lib/documents/types";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { section21Config } from "@/lib/documents/section-21/config";

export type PreviewResult =
  | { ok: true; html: string; document: GeneratedDocument }
  | { ok: false; error: string };

export async function generateSection21Preview(
  raw: Section21FormData,
): Promise<PreviewResult> {
  const parsed = section21Schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }

  try {
    const document = await generateDocument(buildSection21Prompt(parsed.data));
    const html = renderDocumentHtml(document, { watermark: true });
    return { ok: true, html, document };
  } catch {
    return {
      ok: false,
      error: "We couldn't generate your document. Please try again.",
    };
  }
}

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function createSection21Checkout(
  raw: Section21FormData,
  generated: GeneratedDocument,
): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please sign in to continue to payment." };
  }

  const parsed = section21Schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }

  const admin = createAdminClient();

  const { data: docType } = await admin
    .from("document_types")
    .select("id")
    .eq("slug", "section-21")
    .single();

  if (!docType) {
    return { ok: false, error: "Document type not configured." };
  }

  const { data: property, error: propertyError } = await admin
    .from("properties")
    .insert({
      user_id: user.id,
      address_line1: parsed.data.propertyAddressLine1,
      address_line2: parsed.data.propertyAddressLine2 ?? null,
      city: parsed.data.city,
      postcode: parsed.data.postcode.toUpperCase(),
      jurisdiction: parsed.data.jurisdiction,
      tenancy_start: parsed.data.tenancyStartDate,
      rent_amount: parsed.data.rentAmount,
      deposit_scheme: parsed.data.depositScheme || null,
    })
    .select("id")
    .single();

  if (propertyError || !property) {
    return { ok: false, error: "Could not save property details." };
  }

  const tenantRows = parsed.data.tenantNames
    .filter(Boolean)
    .map((name, index) => ({
      property_id: property.id,
      full_name: name,
      sort_order: index,
    }));

  if (tenantRows.length > 0) {
    await admin.from("tenants").insert(tenantRows);
  }

  const { data: document, error: docError } = await admin
    .from("documents")
    .insert({
      user_id: user.id,
      property_id: property.id,
      document_type_id: docType.id,
      status: "preview",
      form_data: parsed.data,
      generated_content: generated,
      watermark: true,
    })
    .select("id")
    .single();

  if (docError || !document) {
    return { ok: false, error: "Could not save document." };
  }

  const stripe = getStripe();

  let customerId: string | undefined;
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_customer_id) {
    customerId = profile.stripe_customer_id;
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await admin
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: section21Config.pricePence,
          product_data: {
            name: section21Config.name,
            description: "PDF download + 30-day re-edit",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      document_id: document.id,
      document_type: "section-21",
      purchase_type: "single_doc",
    },
    success_url: `${site.url}/documents/section-21/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/documents/section-21?cancelled=1`,
  });

  if (!session.url) {
    return { ok: false, error: "Could not start checkout." };
  }

  await admin.from("purchases").insert({
    user_id: user.id,
    stripe_checkout_session_id: session.id,
    type: "single_doc",
    amount_pence: section21Config.pricePence,
    status: "pending",
  });

  return { ok: true, url: session.url };
}

export async function getPurchasedDocument(sessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = createAdminClient();
  const { data: purchase } = await admin
    .from("purchases")
    .select("id, status, user_id")
    .eq("stripe_checkout_session_id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!purchase || purchase.status !== "completed") return null;

  const { data: document } = await admin
    .from("documents")
    .select("id, generated_content, watermark, status")
    .eq("user_id", user.id)
    .eq("purchase_id", purchase.id)
    .single();

  return document;
}
