#!/usr/bin/env node
/**
 * Generate branded Supabase Auth email templates locally and push them to hosted Supabase.
 *
 * Requires:
 *   SUPABASE_ACCESS_TOKEN — https://supabase.com/dashboard/account/tokens
 *   NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF)
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=... npm run configure:auth-email-templates
 *   npm run generate:auth-email-templates   # local files only
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { allEmailTemplates } from "./lib/auth-email-templates.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const templatesDir = join(root, "supabase/templates");

function writeLocalTemplates() {
  mkdirSync(templatesDir, { recursive: true });
  for (const template of allEmailTemplates) {
    const filePath = join(templatesDir, template.file);
    mkdirSync(dirname(filePath), { recursive: true });
    const content = template.build();
    writeFileSync(filePath, content, "utf8");
  }
}

async function pushHostedTemplates() {
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const projectRef =
    process.env.PROJECT_REF?.trim() ?? url?.match(/https:\/\/([^.]+)\./)?.[1];

  if (!token || !projectRef) {
    console.error(
      "Set SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL (or PROJECT_REF) to push hosted templates.",
    );
    process.exit(1);
  }

  const payload = {};
  for (const template of allEmailTemplates) {
    payload[template.subjectKey] = template.subject;
    payload[template.contentKey] = template.build();
    if (template.enabledKey) {
      payload[template.enabledKey] = true;
    }
  }

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    console.error(`PATCH failed (${res.status}):`, detail);
    process.exit(1);
  }

  console.log(
    `Updated ${allEmailTemplates.length} email templates for project ${projectRef}.`,
  );
}

writeLocalTemplates();
console.log(`Wrote ${allEmailTemplates.length} templates to supabase/templates/`);

if (process.argv.includes("--local-only")) {
  process.exit(0);
}

await pushHostedTemplates();
