#!/usr/bin/env node
/**
 * M2 organic funnel — weekly Supabase counts (complements Vercel Analytics events).
 *
 * Usage:
 *   npm run funnel:metrics
 *   npm run funnel:metrics -- --days=14
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

const daysArg = process.argv.find((a) => a.startsWith("--days="));
const days = daysArg ? Number(daysArg.split("=")[1]) : 7;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const founderEmails = (process.env.FOUNDER_EMAILS ?? "scott@letlogic.app")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

if (!url || !serviceKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

if (!Number.isFinite(days) || days < 1) {
  console.error("--days must be a positive number");
  process.exit(1);
}

const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: users, error: usersError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (usersError) {
  console.error("listUsers failed:", usersError.message);
  process.exit(1);
}

const recentUsers = users.users.filter((u) => u.created_at >= since);
const organicUsers = recentUsers.filter(
  (u) => !founderEmails.includes(u.email?.toLowerCase() ?? ""),
);

const [
  { count: assessmentsRecent },
  { count: purchasesRecent },
  { data: purchaseRows },
  { data: screeningUsers },
] = await Promise.all([
  admin
    .from("assessments")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since),
  admin
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since)
    .eq("status", "completed"),
  admin
    .from("purchases")
    .select("user_id")
    .gte("created_at", since)
    .eq("status", "completed"),
  admin.from("assessments").select("user_id").gte("created_at", since),
]);

const purchasers = new Set((purchaseRows ?? []).map((r) => r.user_id));
const screeners = new Set((screeningUsers ?? []).map((r) => r.user_id));
const paidThenScreened = [...purchasers].filter((id) => screeners.has(id)).length;

console.log(`LetLogic funnel metrics — last ${days} day(s)\n`);
console.log(`  Window since:     ${since.slice(0, 10)}`);
console.log(`  New signups:      ${recentUsers.length} (${organicUsers.length} non-founder)`);
console.log(`  Assessments:      ${assessmentsRecent ?? 0}`);
console.log(`  Purchases:        ${purchasesRecent ?? 0}`);
console.log(`  Paid → screened:  ${paidThenScreened} user(s) in window`);

console.log("\nM2 targets (6 weeks):");
console.log("  ○ 3+ non-founder signups");
console.log("  ○ 1+ organic checkout + first_screen_complete");
console.log("\nVercel Analytics events: sample_viewed, signup_completed, checkout_started, first_screen_complete");
console.log("See docs/product/M2-Metrics.md for weekly review template.");

process.exit(0);
