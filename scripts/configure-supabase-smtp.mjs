#!/usr/bin/env node
/**
 * Configure hosted Supabase Auth to send via Resend SMTP and relax email rate limits.
 *
 * Requires:
 *   SUPABASE_ACCESS_TOKEN — https://supabase.com/dashboard/account/tokens
 *   NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF)
 *   RESEND_API_KEY — Resend API key (used as SMTP password)
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

const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? localEnv.NEXT_PUBLIC_SUPABASE_URL?.trim();
const resendKey = process.env.RESEND_API_KEY?.trim() ?? localEnv.RESEND_API_KEY?.trim();
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
  rate_limit_email_sent: 30,
};

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
  `Configured Resend SMTP for ${projectRef}. rate_limit_email_sent=${data.rate_limit_email_sent}`,
);
