#!/usr/bin/env node
/**
 * Stripe env + connectivity checks (local .env.local or Vercel-pulled env).
 *
 * Usage:
 *   npm run verify:stripe
 *   node scripts/verify-stripe.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import Stripe from "stripe";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

const WEBHOOK_URL = "https://www.letlogic.app/api/webhooks/stripe";
const checks = [];

function pass(name, detail) {
  checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function keyMode(value, livePrefix, testPrefix) {
  if (!value) return "missing";
  if (value.startsWith(livePrefix)) return "live";
  if (value.startsWith(testPrefix)) return "test";
  return "unknown";
}

const secret = process.env.STRIPE_SECRET_KEY?.trim();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();

const secretMode = keyMode(secret, "sk_live_", "sk_test_");
const publishableMode = keyMode(publishable, "pk_live_", "pk_test_");

if (secretMode === "missing") fail("STRIPE_SECRET_KEY", "not set");
else if (secretMode === "unknown") fail("STRIPE_SECRET_KEY", "unrecognised format");
else pass("STRIPE_SECRET_KEY", secretMode);

if (!webhookSecret) fail("STRIPE_WEBHOOK_SECRET", "not set");
else if (!webhookSecret.startsWith("whsec_")) fail("STRIPE_WEBHOOK_SECRET", "expected whsec_ prefix");
else pass("STRIPE_WEBHOOK_SECRET", "present");

if (publishableMode === "missing") fail("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "not set");
else if (publishableMode === "unknown") fail("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "unrecognised format");
else pass("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", publishableMode);

if (secretMode !== "missing" && publishableMode !== "missing" && secretMode !== publishableMode) {
  fail("key-mode-match", `${secretMode} secret vs ${publishableMode} publishable`);
} else if (secretMode !== "missing" && publishableMode !== "missing") {
  pass("key-mode-match", secretMode);
}

let stripe = null;
if (secret && secretMode !== "unknown") {
  stripe = new Stripe(secret, { apiVersion: "2026-05-27.dahlia" });
  try {
    const account = await stripe.accounts.retrieve();
    pass(
      "stripe-api",
      `charges ${account.charges_enabled ? "on" : "off"}, payouts ${account.payouts_enabled ? "on" : "off"}`,
    );
  } catch (err) {
    fail("stripe-api", err instanceof Error ? err.message : String(err));
  }
}

if (stripe) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: 499,
            product_data: { name: "LetLogic verify:stripe smoke test" },
          },
          quantity: 1,
        },
      ],
      success_url: "https://www.letlogic.app/dashboard?verify=stripe",
      cancel_url: "https://www.letlogic.app/pricing?verify=stripe",
    });
    if (session.url) {
      pass("checkout-session", "creates successfully");
      await stripe.checkout.sessions.expire(session.id);
    } else {
      fail("checkout-session", "no redirect URL returned");
    }
  } catch (err) {
    fail("checkout-session", err instanceof Error ? err.message : String(err));
  }
}

if (stripe) {
  try {
    const endpoints = await stripe.webhookEndpoints.list({ limit: 20 });
    const match = endpoints.data.find((e) => e.url === WEBHOOK_URL);
    if (!match) {
      fail("webhook-endpoint", `no endpoint for ${WEBHOOK_URL}`);
    } else {
      const required = ["checkout.session.completed", "invoice.paid"];
      const missing = required.filter((e) => !match.enabled_events.includes(e));
      if (missing.length) {
        fail("webhook-events", `missing: ${missing.join(", ")}`);
      } else {
        pass("webhook-endpoint", `${match.status}, events OK`);
      }
    }
  } catch (err) {
    fail("webhook-endpoint", err instanceof Error ? err.message : String(err));
  }
}

if (stripe && webhookSecret) {
  const payload = JSON.stringify({ id: "evt_verify", object: "event", type: "ping" });
  const header = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: webhookSecret,
  });
  try {
    stripe.webhooks.constructEvent(payload, header, webhookSecret);
    pass("webhook-secret", "signature verification OK");
  } catch (err) {
    fail("webhook-secret", err instanceof Error ? err.message : String(err));
  }
}

try {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (res.status === 400) {
    pass("production-webhook-route", "returns 400 without signature (expected)");
  } else {
    fail("production-webhook-route", `expected 400, got ${res.status}`);
  }
} catch (err) {
  fail("production-webhook-route", err instanceof Error ? err.message : String(err));
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
