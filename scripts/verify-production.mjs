#!/usr/bin/env node
/**
 * Production readiness checks for LetLogic.
 *
 * Usage:
 *   node scripts/verify-production.mjs
 *   PLAYWRIGHT_BASE_URL=https://www.letlogic.app node scripts/verify-production.mjs
 */

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
loadEnvFile(resolve(process.cwd(), ".env"));

const baseUrl = (
  process.env.PLAYWRIGHT_BASE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.letlogic.app"
).replace(/\/$/, "");

const checks = [];

function pass(name, detail) {
  checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchOk(path, { expectStatus = 200, expectIncludes } = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, { redirect: "follow" });
  const body = await res.text();
  if (res.status !== expectStatus) {
    throw new Error(`${url} returned ${res.status}`);
  }
  if (expectIncludes && !body.includes(expectIncludes)) {
    throw new Error(`${url} missing expected content: ${expectIncludes}`);
  }
  return { url, status: res.status };
}

function checkEnv(name, { required = false } = {}) {
  const value = process.env[name]?.trim();
  if (value) {
    pass(`env:${name}`, "set");
    return true;
  }
  if (required) {
    fail(`env:${name}`, "missing");
    return false;
  }
  fail(`env:${name}`, "not set (optional locally)");
  return false;
}

async function fetchRedirect(url, { expectStatus = [301, 302, 307, 308] } = {}) {
  const res = await fetch(url, { redirect: "manual" });
  const statuses = Array.isArray(expectStatus) ? expectStatus : [expectStatus];
  if (!statuses.includes(res.status)) {
    throw new Error(`${url} returned ${res.status}, expected redirect`);
  }
  return {
    status: res.status,
    location: res.headers.get("location") ?? "",
  };
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  return match?.[1] ?? null;
}

function extractIconLinks(html) {
  return [...html.matchAll(/<link[^>]+rel="(?:icon|apple-touch-icon|shortcut icon)"[^>]*>/gi)].map(
    (match) => match[0],
  );
}

function normalizeCanonicalUrl(url) {
  const parsed = new URL(url);
  if (parsed.pathname === "/" && !parsed.search && !parsed.hash) {
    return `${parsed.protocol}//${parsed.host}`;
  }
  return url.replace(/\/+$/, "");
}

function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function main() {
  console.log(`Verifying LetLogic at ${baseUrl}\n`);

  // Public pages
  for (const [path, needle] of [
    ["/", "Rent smarter. Trust faster."],
    ["/pricing", "Simple, honest pricing"],
    ["/how-it-works", "How it works"],
    ["/sample", "Sample report"],
    ["/privacy", "Privacy Policy"],
    ["/terms", "Terms of Service"],
    ["/robots.txt", "Sitemap:"],
    ["/sitemap.xml", "<urlset"],
  ]) {
    try {
      const { status } = await fetchOk(path, { expectIncludes: needle });
      pass(`page:${path}`, String(status));
    } catch (err) {
      fail(`page:${path}`, err.message);
    }
  }

  // App routes should not be openly indexable (noindex in HTML)
  try {
    const res = await fetch(`${baseUrl}/login`);
    const body = await res.text();
    if (/noindex/i.test(body)) {
      pass("seo:login-noindex", "robots noindex present");
    } else {
      fail("seo:login-noindex", "expected noindex on /login");
    }
  } catch (err) {
    fail("seo:login-noindex", err.message);
  }

  // Favicon — every public and app route should declare brand icons
  const faviconPaths = ["/", "/login", "/dashboard", "/pricing"];
  for (const path of faviconPaths) {
    try {
      const res = await fetch(`${baseUrl}${path}`);
      const body = await res.text();
      const iconLinks = extractIconLinks(body);
      if (iconLinks.length < 2) {
        throw new Error(`expected icon links, got ${iconLinks.length}`);
      }
      if (!body.includes('/brand/icon.svg')) {
        throw new Error("missing /brand/icon.svg icon link");
      }
      if (!body.includes('rel="apple-touch-icon"')) {
        throw new Error("missing apple-touch-icon link");
      }
      pass(`favicon:${path}`, `${iconLinks.length} icon links`);
    } catch (err) {
      fail(`favicon:${path}`, err.message);
    }
  }

  for (const asset of ["/favicon.ico", "/brand/icon.svg", "/icon.png", "/apple-icon"]) {
    try {
      const { status } = await fetchOk(asset);
      pass(`favicon:asset${asset}`, String(status));
    } catch (err) {
      fail(`favicon:asset${asset}`, err.message);
    }
  }

  try {
    const res = await fetch(`${baseUrl}/manifest.webmanifest`);
    const body = await res.text();
    if (!body.includes("/brand/icon.svg") || !body.includes("/apple-icon")) {
      throw new Error("manifest missing brand icon entries");
    }
    pass("favicon:manifest", "brand icons present");
  } catch (err) {
    fail("favicon:manifest", err.message);
  }

  // SEO — canonical host/path consistency (AGE-84)
  try {
    const apex = await fetchRedirect("https://letlogic.app/pricing");
    const apexTarget = new URL(apex.location, "https://letlogic.app");
    if (
      apexTarget.hostname !== "www.letlogic.app" ||
      apexTarget.pathname !== "/pricing"
    ) {
      throw new Error(`apex redirect target was ${apexTarget.href}`);
    }
    pass("seo:apex-redirect", `${apex.status} → ${apexTarget.href}`);
  } catch (err) {
    fail("seo:apex-redirect", err.message);
  }

  try {
    const slash = await fetchRedirect(`${baseUrl}/pricing/`);
    const slashTarget = new URL(slash.location, baseUrl);
    if (slashTarget.pathname !== "/pricing") {
      throw new Error(`trailing-slash redirect target was ${slashTarget.href}`);
    }
    pass("seo:trailing-slash", `${slash.status} → ${slashTarget.pathname}`);
  } catch (err) {
    fail("seo:trailing-slash", err.message);
  }

  const samplePaths = ["/", "/pricing", "/how-it-works"];
  let sitemapUrls = new Set();
  try {
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
    const sitemapXml = await sitemapRes.text();
    if (!sitemapRes.ok || !sitemapXml.includes("<urlset")) {
      throw new Error(`sitemap returned ${sitemapRes.status}`);
    }
    const sitemapLocs = extractSitemapLocs(sitemapXml);
    if (sitemapLocs.length < 10) {
      throw new Error(`expected at least 10 URLs, got ${sitemapLocs.length}`);
    }
    for (const loc of sitemapLocs) {
      const parsed = new URL(loc);
      if (parsed.hostname !== "www.letlogic.app") {
        throw new Error(`non-canonical host in sitemap: ${loc}`);
      }
      if (loc.endsWith("/") && parsed.pathname !== "/") {
        throw new Error(`trailing slash in sitemap: ${loc}`);
      }
    }
    sitemapUrls = new Set(
      sitemapLocs.map((loc) => normalizeCanonicalUrl(loc)),
    );
    pass("seo:sitemap", `${sitemapLocs.length} canonical URLs`);
  } catch (err) {
    fail("seo:sitemap", err.message);
  }

  for (const path of samplePaths) {
    try {
      const res = await fetch(`${baseUrl}${path}`);
      const body = await res.text();
      const canonical = extractCanonical(body);
      const expected = path === "/" ? baseUrl : `${baseUrl}${path}`;
      if (canonical !== expected) {
        throw new Error(`canonical ${canonical ?? "missing"} !== ${expected}`);
      }
      if (sitemapUrls.size > 0 && !sitemapUrls.has(normalizeCanonicalUrl(canonical))) {
        throw new Error(`canonical not present in sitemap: ${canonical}`);
      }
      pass(`seo:canonical${path}`, canonical);
    } catch (err) {
      fail(`seo:canonical${path}`, err.message);
    }
  }

  // Search Console readiness (AGE-85)
  try {
    const res = await fetch(`${baseUrl}/`);
    const body = await res.text();
    if (!/google-site-verification/i.test(body)) {
      throw new Error("missing google-site-verification meta tag");
    }
    pass("seo:gsc-verification-meta", "present on homepage");
  } catch (err) {
    fail("seo:gsc-verification-meta", err.message);
  }

  try {
    const res = await fetch(`${baseUrl}/robots.txt`);
    const body = await res.text();
    const expectedSitemap = `${baseUrl}/sitemap.xml`;
    if (!body.includes(`Sitemap: ${expectedSitemap}`)) {
      throw new Error(`robots.txt missing ${expectedSitemap}`);
    }
    pass("seo:robots-sitemap", expectedSitemap);
  } catch (err) {
    fail("seo:robots-sitemap", err.message);
  }

  if (process.env.SENTRY_DSN) {
    try {
      const res = await fetch(`${baseUrl}/api/sentry-example`);
      if (res.status === 500) {
        pass("sentry:example-route", "reachable");
      } else {
        fail("sentry:example-route", `expected 500, got ${res.status}`);
      }
    } catch (err) {
      fail("sentry:example-route", err.message);
    }
  }

  // Sole trader launch gate: legal/trading name only (no Companies House number or public address).
  const legalName =
    process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME?.trim() || "LetLogic";
  const entityType = (
    process.env.NEXT_PUBLIC_COMPANY_ENTITY_TYPE?.trim() || "sole_trader"
  ).toLowerCase();
  const placeholderName = legalName === "Your Business Name";

  if (!placeholderName && entityType === "sole_trader") {
    pass(
      "legal:company-details",
      `sole trader configured (${legalName})`,
    );
  } else if (process.env.ALLOW_PRE_INCORPORATION === "1") {
    pass(
      "legal:company-details",
      "skipped (ALLOW_PRE_INCORPORATION=1)",
    );
  } else {
    fail(
      "legal:company-details",
      "set NEXT_PUBLIC_COMPANY_LEGAL_NAME and NEXT_PUBLIC_COMPANY_ENTITY_TYPE=sole_trader (or ALLOW_PRE_INCORPORATION=1 for pilot)",
    );
  }

  checkEnv("NEXT_PUBLIC_SUPABASE_URL", { required: false });
  checkEnv("STRIPE_SECRET_KEY", { required: false });
  checkEnv("STRIPE_WEBHOOK_SECRET", { required: false });
  checkEnv("SENTRY_DSN", { required: false });

  const failed = checks.filter((c) => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);

  if (failed.some((c) => c.name.startsWith("page:") || c.name.startsWith("seo:") || c.name.startsWith("favicon:"))) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
