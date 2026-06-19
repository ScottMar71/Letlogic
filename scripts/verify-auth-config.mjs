#!/usr/bin/env node
/**
 * Verify hosted Supabase Auth is hardened against email abuse.
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=... npm run verify:auth-config
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

function loadEnvFile(path) {
  try {
    return Object.fromEntries(
      readFileSync(path, "utf8")
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const index = line.indexOf("=");
          return [line.slice(0, index), line.slice(index + 1)];
        }),
    );
  } catch {
    return {};
  }
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const localEnv = loadEnvFile(join(root, ".env.local"));

const token =
  process.env.SUPABASE_ACCESS_TOKEN?.trim() ?? localEnv.SUPABASE_ACCESS_TOKEN?.trim();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? localEnv.NEXT_PUBLIC_SUPABASE_URL?.trim();
const projectRef =
  process.env.PROJECT_REF?.trim() ?? url?.match(/https:\/\/([^.]+)\./)?.[1];

if (!token || !projectRef) {
  console.error(
    "Set SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF).",
  );
  process.exit(1);
}

const res = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);

if (!res.ok) {
  console.error(`GET failed (${res.status}):`, await res.text());
  process.exit(1);
}

const config = await res.json();
const checks = [];

function pass(name, detail) {
  checks.push({ ok: true, name, detail });
  console.log(`✓ ${name}: ${detail}`);
}

function fail(name, detail) {
  checks.push({ ok: false, name, detail });
  console.error(`✗ ${name}: ${detail}`);
}

if (config.mailer_autoconfirm === true) {
  pass("mailer_autoconfirm", "signup confirmation emails disabled");
} else {
  fail("mailer_autoconfirm", `expected true, got ${config.mailer_autoconfirm}`);
}

const emailLimit = Number(config.rate_limit_email_sent);
if (Number.isFinite(emailLimit) && emailLimit > 0 && emailLimit <= 15) {
  pass("rate_limit_email_sent", String(emailLimit));
} else {
  fail(
    "rate_limit_email_sent",
    `expected 1–15, got ${config.rate_limit_email_sent}`,
  );
}

const minInterval = Number(config.smtp_max_frequency);
if (Number.isFinite(minInterval) && minInterval >= 60) {
  pass("smtp_max_frequency", `${minInterval}s between emails to same address`);
} else {
  fail(
    "smtp_max_frequency",
    `expected >= 60 seconds, got ${config.smtp_max_frequency}`,
  );
}

if (config.security_sb_forwarded_for_enabled === true) {
  pass("security_sb_forwarded_for_enabled", "Vercel/client IP forwarding enabled");
} else {
  fail(
    "security_sb_forwarded_for_enabled",
    `expected true, got ${config.security_sb_forwarded_for_enabled}`,
  );
}

if (config.security_captcha_enabled === true) {
  if (config.security_captcha_provider === "turnstile") {
    pass("security_captcha", "Turnstile enabled");
  } else {
    fail(
      "security_captcha",
      `expected turnstile provider, got ${config.security_captcha_provider}`,
    );
  }
} else {
  fail("security_captcha", "CAPTCHA disabled — bots can spam password reset");
}

const siteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ??
  localEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
if (siteKey) {
  pass("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "set in env");
} else {
  fail("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "missing — signup/reset forms skip CAPTCHA UI");
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);

if (failed.length > 0) {
  console.log("\nFix: npm run configure:supabase-smtp (with RESEND_API_KEY + TURNSTILE_SECRET_KEY)");
  process.exit(1);
}
