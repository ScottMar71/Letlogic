#!/usr/bin/env node
/**
 * Harden Supabase Auth + optional custom SMTP (hosted project).
 *
 * Always:
 * - Skips signup confirmation emails (mailer_autoconfirm)
 * - Enables Cloudflare Turnstile when TURNSTILE_SECRET_KEY is set
 * - Enables forwarded-IP rate limiting (required on Vercel)
 *
 * When SMTP_HOST + SMTP_USER + SMTP_PASS are set (e.g. Zoho Mail):
 * - Configures custom SMTP for auth mail (password reset, etc.)
 * - Caps project-wide auth email rate and per-address send frequency
 *
 * Zoho checklist:
 *   1. Confirm host in Zoho Mail → Settings → Mail Accounts → Server details
 *      (smtp.zoho.com|eu|… or smtppro.zoho.* for paid org; region must match)
 *   2. Port 587 (STARTTLS) preferred; username = full mailbox address
 *   3. Use an app-specific password if 2FA is enabled
 *   4. From address (SMTP_ADMIN_EMAIL) must be that mailbox or an allowed alias
 *
 * Requires:
 *   SUPABASE_ACCESS_TOKEN — https://supabase.com/dashboard/account/tokens
 *   NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF)
 *   TURNSTILE_SECRET_KEY — optional but strongly recommended for production
 *   SMTP_HOST, SMTP_USER, SMTP_PASS — optional; required to send auth mail via Zoho
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=... npm run configure:supabase-smtp
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

function env(key, localEnv) {
  return process.env[key]?.trim() ?? localEnv[key]?.trim() ?? "";
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const localEnv = loadEnvFile(join(root, ".env.local"));

const token = env("SUPABASE_ACCESS_TOKEN", localEnv);
const url = env("NEXT_PUBLIC_SUPABASE_URL", localEnv);
const turnstileSecret = env("TURNSTILE_SECRET_KEY", localEnv);
const projectRef =
  env("PROJECT_REF", localEnv) || url.match(/https:\/\/([^.]+)\./)?.[1] || "";

const smtpHost = env("SMTP_HOST", localEnv);
const smtpUser = env("SMTP_USER", localEnv);
const smtpPass = env("SMTP_PASS", localEnv);
const smtpPort = env("SMTP_PORT", localEnv) || "587";
const smtpAdminEmail =
  env("SMTP_ADMIN_EMAIL", localEnv) ||
  env("NEXT_PUBLIC_CONTACT_EMAIL", localEnv) ||
  "hello@letlogic.app";
const smtpSenderName = env("SMTP_SENDER_NAME", localEnv) || "LetLogic";

/** Project-wide cap on auth emails per hour (recovery, email change, etc.). */
const EMAIL_SENT_PER_HOUR = Number(env("AUTH_EMAIL_RATE_LIMIT", localEnv) || "10");

/** Minimum seconds between auth emails to the same address. */
const SMTP_MAX_FREQUENCY_SECONDS = Number(
  env("AUTH_EMAIL_MIN_INTERVAL_SECONDS", localEnv) || "60",
);

const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

if (!token || !projectRef) {
  console.error(
    "Set SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF).",
  );
  process.exit(1);
}

if ((smtpHost || smtpUser || smtpPass) && !smtpConfigured) {
  console.error(
    "Partial SMTP config. Set all of SMTP_HOST, SMTP_USER, and SMTP_PASS (or clear them all).",
  );
  process.exit(1);
}

if (smtpHost.toLowerCase().includes("resend")) {
  console.error(
    "Refusing to configure smtp.resend.com — Resend is retired for this project. Use Zoho (or another) SMTP host.",
  );
  process.exit(1);
}

const body = {
  mailer_autoconfirm: true,
  security_sb_forwarded_for_enabled: true,
};

if (turnstileSecret) {
  body.security_captcha_enabled = true;
  body.security_captcha_provider = "turnstile";
  body.security_captcha_secret = turnstileSecret;
} else {
  console.warn(
    "TURNSTILE_SECRET_KEY not set — CAPTCHA will stay disabled on Supabase. Set it before production.",
  );
}

if (smtpConfigured) {
  body.smtp_admin_email = smtpAdminEmail;
  body.smtp_sender_name = smtpSenderName;
  body.smtp_host = smtpHost;
  body.smtp_port = smtpPort;
  body.smtp_user = smtpUser;
  body.smtp_pass = smtpPass;
  body.rate_limit_email_sent = EMAIL_SENT_PER_HOUR;
  body.smtp_max_frequency = SMTP_MAX_FREQUENCY_SECONDS;
} else {
  console.warn(
    "SMTP_* not set — custom SMTP will not be configured. Auth mail stays on Supabase defaults until Zoho (or another provider) is wired.",
  );
}

const res = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  },
);

if (!res.ok) {
  const detail = await res.text();
  console.error(`PATCH failed (${res.status}):`, detail);
  process.exit(1);
}

const data = await res.json();
console.log(
  [
    `Configured auth hardening for ${projectRef}.`,
    `mailer_autoconfirm=${data.mailer_autoconfirm}`,
    `security_captcha_enabled=${data.security_captcha_enabled}`,
    `security_sb_forwarded_for_enabled=${data.security_sb_forwarded_for_enabled}`,
    `custom_smtp=${data.smtp_host ? data.smtp_host : "disabled"}`,
    data.smtp_host
      ? `rate_limit_email_sent=${data.rate_limit_email_sent} smtp_max_frequency=${data.smtp_max_frequency}`
      : null,
  ]
    .filter(Boolean)
    .join(" "),
);

if (!turnstileSecret) {
  console.log(
    "Next: create a Turnstile widget, set NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY, then re-run this script.",
  );
}

if (!smtpConfigured) {
  console.log(
    "Next (email): set SMTP_HOST / SMTP_USER / SMTP_PASS for Zoho, then re-run this script.",
  );
}
