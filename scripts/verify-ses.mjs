#!/usr/bin/env node
/**
 * Amazon SES env + send smoke test (loads .env.local).
 *
 * Usage:
 *   SES_TEST_TO=you@example.com npm run verify:ses
 *   npm run verify:ses -- you@example.com
 *   npm run verify:ses -- --dry-run   # env checks only, no send
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

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
loadEnvFile(resolve(process.cwd(), ".env"));

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const recipientArg = args.find((a) => !a.startsWith("--"));
const testTo =
  process.env.SES_TEST_TO?.trim() ||
  recipientArg ||
  "";

const region = process.env.AWS_REGION?.trim() || "eu-west-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
const fromEmail =
  process.env.SES_FROM_EMAIL?.trim() ||
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  "hello@letlogic.app";
const fromName = process.env.SES_FROM_NAME?.trim() || "LetLogic";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.letlogic.app";

const checks = [];

function pass(name, detail) {
  checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

if (accessKeyId) pass("AWS_ACCESS_KEY_ID", "set");
else fail("AWS_ACCESS_KEY_ID", "not set");

if (secretAccessKey) pass("AWS_SECRET_ACCESS_KEY", "set");
else fail("AWS_SECRET_ACCESS_KEY", "not set");

pass("AWS_REGION", region);

if (fromEmail.includes("@")) pass("SES_FROM_EMAIL", fromEmail);
else fail("SES_FROM_EMAIL", `invalid: ${fromEmail}`);

pass("SES_FROM_NAME", fromName);

if (dryRun) {
  pass("send", "skipped (--dry-run)");
} else if (!testTo) {
  fail(
    "SES_TEST_TO",
    "set SES_TEST_TO or pass recipient: npm run verify:ses -- you@example.com",
  );
} else if (!testTo.includes("@")) {
  fail("SES_TEST_TO", `invalid address: ${testTo}`);
} else {
  pass("SES_TEST_TO", testTo);
}

const envFailed = checks.some((c) => !c.ok);
if (envFailed || dryRun || !testTo || !accessKeyId || !secretAccessKey) {
  const failed = checks.filter((c) => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  if (failed.length) {
    console.log(
      "\nFix: set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_FROM_EMAIL in .env.local",
    );
    console.log(
      "SES sandbox: verify sender + recipient in AWS SES, or request production access.",
    );
  }
  process.exit(failed.length ? 1 : 0);
}

const client = new SESv2Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

const subject = "LetLogic SES verify — test message";
const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family:sans-serif;line-height:1.5;color:#0F1C2E;">
  <p>This is a <strong>LetLogic</strong> Amazon SES smoke test.</p>
  <p>If you received this, outbound app email is configured correctly.</p>
  <p style="color:#5A6B7D;font-size:14px;">Region: ${region} · From: ${fromEmail}</p>
  <p><a href="${siteUrl}">${siteUrl}</a></p>
</body>
</html>`;
const text = `LetLogic Amazon SES smoke test.

If you received this, outbound app email is configured correctly.

Region: ${region}
From: ${fromEmail}
${siteUrl}`;

try {
  const result = await client.send(
    new SendEmailCommand({
      FromEmailAddress: `${fromName} <${fromEmail}>`,
      Destination: { ToAddresses: [testTo] },
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: html, Charset: "UTF-8" },
            Text: { Data: text, Charset: "UTF-8" },
          },
        },
      },
      EmailTags: [{ Name: "type", Value: "verify_ses" }],
    }),
  );
  pass("ses-send", result.MessageId ? `MessageId ${result.MessageId}` : "sent");
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  fail("ses-send", message);
  if (/sandbox|not verified|MessageRejected/i.test(message)) {
    console.error(
      "\nHint: In SES sandbox, verify both sender and recipient identities, or request production access.",
    );
  }
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
