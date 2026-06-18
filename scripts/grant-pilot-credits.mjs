#!/usr/bin/env node
/**
 * Grant complimentary pilot credits to a design partner.
 *
 * Usage:
 *   PARTNER_EMAIL=landlord@example.com npm run grant:pilot
 *   PARTNER_EMAIL=landlord@example.com PILOT_CREDITS=25 npm run grant:pilot
 *
 * Partner must have signed in once (auth user exists).
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
const credits = Number(process.env.PILOT_CREDITS ?? "20");

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
  console.error(
    `No auth user for ${email}. Ask them to sign in at https://www.letlogic.app/login first.`,
  );
  process.exit(1);
}

const { error: profileError } = await admin.from("profiles").upsert({
  id: user.id,
  email: user.email,
});
if (profileError) {
  console.error("profiles upsert failed:", profileError.message);
  process.exit(1);
}

const { error: ledgerError } = await admin.from("credit_ledger").insert({
  user_id: user.id,
  delta: credits,
  reason: "adjustment",
});
if (ledgerError) {
  console.error("credit_ledger insert failed:", ledgerError.message);
  process.exit(1);
}

const { count } = await admin
  .from("credit_ledger")
  .select("delta", { count: "exact", head: true })
  .eq("user_id", user.id);

console.log(`Pilot credits granted to ${email}`);
console.log(`  User ID: ${user.id}`);
console.log(`  Added:   ${credits} credits`);
console.log(`  Balance: ${count ?? "?"} ledger rows (sum deltas for balance)`);
