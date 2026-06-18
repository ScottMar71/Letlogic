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

const PLACEHOLDER_COMPANY_NUMBER = "00000000";
const PLACEHOLDER_ADDRESS = "[Registered office address]";

export const site = {
  name: "LetLogic",
  domain: "letlogic.app",
  url: env("NEXT_PUBLIC_SITE_URL", "https://www.letlogic.app"),
  description:
    "AI-powered tenant screening for UK landlords — turn applicant data into a clear risk score, summary, and recommendation in seconds.",
  email: env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@letlogic.app"),
  supportEmail: env("NEXT_PUBLIC_SUPPORT_EMAIL", "support@letlogic.app"),
  privacyEmail: env("NEXT_PUBLIC_PRIVACY_EMAIL", "privacy@letlogic.app"),
  company: {
    legalName: env("NEXT_PUBLIC_COMPANY_LEGAL_NAME", "LetLogic Ltd"),
    registeredIn: env(
      "NEXT_PUBLIC_COMPANY_REGISTERED_IN",
      "England and Wales",
    ),
    companyNumber: env(
      "NEXT_PUBLIC_COMPANY_NUMBER",
      PLACEHOLDER_COMPANY_NUMBER,
    ),
    address: env("NEXT_PUBLIC_COMPANY_ADDRESS", PLACEHOLDER_ADDRESS),
  },
  legalUpdated: env("NEXT_PUBLIC_LEGAL_UPDATED", "17 June 2026"),
  /** Public social/profile URLs used for Organization `sameAs`. Optional. */
  socialUrls: envList("NEXT_PUBLIC_SOCIAL_URLS"),
} as const;

/** True when real registered company details are configured (not placeholders). */
export function isLegalConfigured(): boolean {
  return (
    site.company.companyNumber !== PLACEHOLDER_COMPANY_NUMBER &&
    site.company.address !== PLACEHOLDER_ADDRESS &&
    !site.company.address.startsWith("[")
  );
}
