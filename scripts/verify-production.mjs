#!/usr/bin/env node
/**
 * Production readiness checks for LetLogic.
 *
 * Usage:
 *   node scripts/verify-production.mjs
 *   PLAYWRIGHT_BASE_URL=https://www.letlogic.app node scripts/verify-production.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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

const baseUrl = (
  process.env.PLAYWRIGHT_BASE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.letlogic.app"
).replace(/\/$/, "");

const checks = [];

function pass(name, detail) {
  checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchOk(path, { expectStatus = 200, expectIncludes } = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, { redirect: "follow" });
  const body = await res.text();
  if (res.status !== expectStatus) {
    throw new Error(`${url} returned ${res.status}`);
  }
  if (expectIncludes && !body.includes(expectIncludes)) {
    throw new Error(`${url} missing expected content: ${expectIncludes}`);
  }
  return { url, status: res.status };
}

function checkEnv(name, { required = false } = {}) {
  const value = process.env[name]?.trim();
  if (value) {
    pass(`env:${name}`, "set");
    return true;
  }
  if (required) {
    fail(`env:${name}`, "missing");
    return false;
  }
  fail(`env:${name}`, "not set (optional locally)");
  return false;
}

async function main() {
  console.log(`Verifying LetLogic at ${baseUrl}\n`);

  // Public pages
  for (const [path, needle] of [
    ["/", "Rent smarter. Trust faster."],
    ["/pricing", "Simple, honest pricing"],
    ["/how-it-works", "How it works"],
    ["/sample", "Sample report"],
    ["/privacy", "Privacy Policy"],
    ["/terms", "Terms of Service"],
    ["/robots.txt", "Sitemap:"],
    ["/sitemap.xml", "<urlset"],
  ]) {
    try {
      const { status } = await fetchOk(path, { expectIncludes: needle });
      pass(`page:${path}`, String(status));
    } catch (err) {
      fail(`page:${path}`, err.message);
    }
  }

  // App routes should not be openly indexable (noindex in HTML)
  try {
    const res = await fetch(`${baseUrl}/login`);
    const body = await res.text();
    if (/noindex/i.test(body)) {
      pass("seo:login-noindex", "robots noindex present");
    } else {
      fail("seo:login-noindex", "expected noindex on /login");
    }
  } catch (err) {
    fail("seo:login-noindex", err.message);
  }

  if (process.env.SENTRY_DSN) {
    try {
      const res = await fetch(`${baseUrl}/api/sentry-example`);
      if (res.status === 500) {
        pass("sentry:example-route", "reachable");
      } else {
        fail("sentry:example-route", `expected 500, got ${res.status}`);
      }
    } catch (err) {
      fail("sentry:example-route", err.message);
    }
  }

  // Env vars (informational when running without .env)
  const legalVars = [
    "NEXT_PUBLIC_COMPANY_NUMBER",
    "NEXT_PUBLIC_COMPANY_ADDRESS",
  ];
  const legalOk = legalVars.every((name) => Boolean(process.env[name]?.trim()));
  if (legalOk) {
    pass("legal:company-details", "configured");
  } else {
    fail(
      "legal:company-details",
      "set NEXT_PUBLIC_COMPANY_NUMBER and NEXT_PUBLIC_COMPANY_ADDRESS before launch",
    );
  }

  checkEnv("NEXT_PUBLIC_SUPABASE_URL", { required: false });
  checkEnv("STRIPE_SECRET_KEY", { required: false });
  checkEnv("STRIPE_WEBHOOK_SECRET", { required: false });
  checkEnv("RESEND_API_KEY", { required: false });
  checkEnv("SENTRY_DSN", { required: false });

  const failed = checks.filter((c) => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);

  if (failed.some((c) => c.name.startsWith("page:"))) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
