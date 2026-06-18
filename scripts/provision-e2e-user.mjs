#!/usr/bin/env node
/**
 * Grant comp credits to an E2E test user (create user in Supabase Auth first).
 *
 * Usage:
 *   PLAYWRIGHT_TEST_EMAIL=test@example.com npm run provision:e2e-user
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL in env.
 */

import { createClient } from "@supabase/supabase-js";

const email = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const credits = Number(process.env.E2E_CREDIT_GRANT ?? "10");

if (!email || !url || !serviceKey) {
  console.error(
    "Set PLAYWRIGHT_TEST_EMAIL, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY",
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
  console.error(`No auth user found for ${email}. Create the user in Supabase Auth first.`);
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

console.log(`Granted ${credits} credits to ${email} (${user.id})`);
