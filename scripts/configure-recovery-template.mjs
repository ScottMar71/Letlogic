#!/usr/bin/env node
/**
 * Patch hosted Supabase Recovery email template for SSR (token_hash flow).
 *
 * Requires SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens
 * and NEXT_PUBLIC_SUPABASE_URL in env (or pass PROJECT_REF).
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=... npm run configure:recovery-template
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const projectRef =
  process.env.PROJECT_REF?.trim() ?? url?.match(/https:\/\/([^.]+)\./)?.[1];

if (!token || !projectRef) {
  console.error(
    "Set SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF).",
  );
  process.exit(1);
}

const templatePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../supabase/templates/recovery.html",
);
const content = readFileSync(templatePath, "utf8");

const res = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mailer_subjects_recovery: "Reset your LetLogic password",
      mailer_templates_recovery_content: content,
    }),
  },
);

if (!res.ok) {
  const body = await res.text();
  console.error(`PATCH failed (${res.status}):`, body);
  process.exit(1);
}

console.log(
  `Updated Recovery email template for project ${projectRef}. Request a fresh password reset to test.`,
);
