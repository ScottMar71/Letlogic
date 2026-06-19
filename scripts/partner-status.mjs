#!/usr/bin/env node
/**
 * Design partner pilot progress — AGE-72 acceptance criteria.
 *
 * Usage:
 *   PARTNER_EMAIL=landlord@example.com npm run partner:status
 */

import { createClient } from "@supabase/supabase-js";
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

const email = process.env.PARTNER_EMAIL?.trim();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const kickoffDate = process.env.PILOT_KICKOFF_DATE?.trim();

if (!email || !url || !serviceKey) {
  console.error(
    "Set PARTNER_EMAIL, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listError) {
  console.error("listUsers failed:", listError.message);
  process.exit(1);
}

const user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
if (!user) {
  console.error(`No auth user for ${email}. Ask them to sign in first.`);
  process.exit(1);
}

const userId = user.id;

const [{ count: screeningCount }, { count: propertyCount }, { data: ledger }] =
  await Promise.all([
    admin
      .from("assessments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    admin
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    admin.from("credit_ledger").select("delta, reason, created_at").eq("user_id", userId),
  ]);

const balance = (ledger ?? []).reduce((sum, row) => sum + row.delta, 0);
const compCredits = (ledger ?? [])
  .filter((row) => row.reason === "adjustment" && row.delta > 0)
  .reduce((sum, row) => sum + row.delta, 0);

const { data: firstAssessment } = await admin
  .from("assessments")
  .select("created_at")
  .eq("user_id", userId)
  .order("created_at", { ascending: true })
  .limit(1)
  .maybeSingle();

const screenings = screeningCount ?? 0;
const targetScreenings = 5;
const kickoff = kickoffDate ? new Date(kickoffDate) : null;
const weeksElapsed =
  kickoff && firstAssessment?.created_at
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - kickoff.getTime()) / (7 * 24 * 60 * 60 * 1000),
        ),
      )
    : null;

console.log(`Design partner status — ${email}\n`);
console.log(`  User ID:        ${userId}`);
console.log(`  Credit balance: ${balance} (${compCredits} comp via adjustment)`);
console.log(`  Properties:     ${propertyCount ?? 0}`);
console.log(`  Screenings:     ${screenings} / ${targetScreenings} target`);
if (kickoff) console.log(`  Kickoff:        ${kickoff.toISOString().slice(0, 10)}`);
if (weeksElapsed != null) console.log(`  Weeks elapsed:  ${weeksElapsed} / 4`);

const checks = [
  ["Account exists", true],
  ["Comp credits granted", compCredits > 0],
  ["5+ screenings", screenings >= targetScreenings],
  ["Property added", (propertyCount ?? 0) > 0],
];

console.log("\nAGE-72 kickoff checklist:");
for (const [label, ok] of checks) {
  console.log(`  ${ok ? "✓" : "○"} ${label}`);
}

if (screenings >= targetScreenings) {
  console.log("\nPilot screening target met. Document weekly check-ins in Linear.");
  process.exit(0);
}

console.log(
  `\nPilot in progress — ${targetScreenings - screenings} more screening(s) needed.`,
);
process.exit(screenings >= targetScreenings ? 0 : 2);
