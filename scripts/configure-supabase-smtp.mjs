#!/usr/bin/env node
/**
 * Harden Supabase Auth email + bot protection (hosted project).
 *
 * - Routes auth mail through Resend SMTP
 * - Skips signup confirmation emails (mailer_autoconfirm)
 * - Caps project-wide auth email rate and per-address resend frequency
 * - Enables Cloudflare Turnstile when TURNSTILE_SECRET_KEY is set
 * - Enables forwarded-IP rate limiting (required on Vercel)
 *
 * Requires:
 *   SUPABASE_ACCESS_TOKEN — https://supabase.com/dashboard/account/tokens
 *   NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF)
 *   RESEND_API_KEY — Resend API key (used as SMTP password)
 *   TURNSTILE_SECRET_KEY — optional but strongly recommended for production
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

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const localEnv = loadEnvFile(join(root, ".env.local"));

const token =
  process.env.SUPABASE_ACCESS_TOKEN?.trim() ?? localEnv.SUPABASE_ACCESS_TOKEN?.trim();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? localEnv.NEXT_PUBLIC_SUPABASE_URL?.trim();
const resendKey = process.env.RESEND_API_KEY?.trim() ?? localEnv.RESEND_API_KEY?.trim();
const turnstileSecret =
  process.env.TURNSTILE_SECRET_KEY?.trim() ??
  localEnv.TURNSTILE_SECRET_KEY?.trim();
const projectRef =
  process.env.PROJECT_REF?.trim() ?? url?.match(/https:\/\/([^.]+)\./)?.[1];

const smtpAdminEmail =
  process.env.SMTP_ADMIN_EMAIL?.trim() ??
  localEnv.SMTP_ADMIN_EMAIL?.trim() ??
  "support@letlogic.app";
const smtpSenderName =
  process.env.SMTP_SENDER_NAME?.trim() ??
  localEnv.SMTP_SENDER_NAME?.trim() ??
  "LetLogic";

/** Project-wide cap on auth emails per hour (signup confirm, recovery, email change). */
const EMAIL_SENT_PER_HOUR = Number(process.env.AUTH_EMAIL_RATE_LIMIT ?? "10");

/** Minimum seconds between auth emails to the same address. */
const SMTP_MAX_FREQUENCY_SECONDS = Number(
  process.env.AUTH_EMAIL_MIN_INTERVAL_SECONDS ?? "60",
);

if (!token || !projectRef || !resendKey) {
  console.error(
    "Set SUPABASE_ACCESS_TOKEN, NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF), and RESEND_API_KEY.",
  );
  process.exit(1);
}

const body = {
  smtp_admin_email: smtpAdminEmail,
  smtp_sender_name: smtpSenderName,
  smtp_host: "smtp.resend.com",
  smtp_port: "587",
  smtp_user: "resend",
  smtp_pass: resendKey,
  mailer_autoconfirm: true,
  rate_limit_email_sent: EMAIL_SENT_PER_HOUR,
  smtp_max_frequency: SMTP_MAX_FREQUENCY_SECONDS,
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
    `rate_limit_email_sent=${data.rate_limit_email_sent}`,
    `smtp_max_frequency=${data.smtp_max_frequency}`,
    `mailer_autoconfirm=${data.mailer_autoconfirm}`,
    `security_captcha_enabled=${data.security_captcha_enabled}`,
    `security_sb_forwarded_for_enabled=${data.security_sb_forwarded_for_enabled}`,
  ].join(" "),
);

if (!turnstileSecret) {
  console.log(
    "Next: create a Turnstile widget, set NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY, then re-run this script.",
  );
}
