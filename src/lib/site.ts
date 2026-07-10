function env(key: string, fallback: string): string {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
}

/** Parse a comma-separated env var into a trimmed, non-empty string list. */
function envList(key: string): string[] {
  return (process.env[key] ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

const DEFAULT_LEGAL_NAME = "LetLogic";
const PLACEHOLDER_LEGAL_NAME = "Your Business Name";

type EntityType = "sole_trader" | "limited_company";

function entityType(): EntityType {
  const raw = env("NEXT_PUBLIC_COMPANY_ENTITY_TYPE", "sole_trader").toLowerCase();
  return raw === "limited_company" ? "limited_company" : "sole_trader";
}

/** Canonical site origin — always `https://www.letlogic.app` with no trailing slash. */
function canonicalSiteUrl(): string {
  return env("NEXT_PUBLIC_SITE_URL", "https://www.letlogic.app").replace(
    /\/+$/,
    "",
  );
}

const contactEmail = env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@letlogic.app");

export const site = {
  name: "LetLogic",
  domain: "letlogic.app",
  url: canonicalSiteUrl(),
  icons: {
    /** Static brand mark — schema.org logo and direct serving from /public */
    icon: "/brand/icon.svg",
    /** Next.js app/icon.svg — also generates /favicon.ico and /icon.png at build */
    png: "/icon.png",
    apple: "/apple-icon",
  },
  description:
    "Paste an applicant's details and get an explainable risk score, summary, and recommendation — not a credit check, just a faster way to decide.",
  /** Single public inbox — forward hello@ to your personal email at the mail provider. */
  email: contactEmail,
  supportEmail: env("NEXT_PUBLIC_SUPPORT_EMAIL", contactEmail),
  privacyEmail: env("NEXT_PUBLIC_PRIVACY_EMAIL", contactEmail),
  company: {
    legalName: env("NEXT_PUBLIC_COMPANY_LEGAL_NAME", DEFAULT_LEGAL_NAME),
    /** Trading structure — sole trader by default; limited_company only if incorporated later. */
    entityType: entityType(),
    /** Jurisdiction for Terms (not a Companies House registration claim). */
    registeredIn: env(
      "NEXT_PUBLIC_COMPANY_REGISTERED_IN",
      "England and Wales",
    ),
  },
  legalUpdated: env("NEXT_PUBLIC_LEGAL_UPDATED", "17 June 2026"),
  /** Public social/profile URLs used for Organization `sameAs`. Optional. */
  socialUrls: envList("NEXT_PUBLIC_SOCIAL_URLS"),
} as const;

/**
 * True when public legal identity is ready for launch.
 * Sole trader: legal name set (not a placeholder). Address/company number are not required.
 */
export function isLegalConfigured(): boolean {
  const name = site.company.legalName.trim();
  if (!name || name === PLACEHOLDER_LEGAL_NAME) return false;
  if (site.company.entityType === "sole_trader") return true;
  // Limited company would need further fields — not used today.
  return name.length > 0 && name !== "LetLogic Ltd";
}
