export const site = {
  name: "LetLogic",
  domain: "letlogic.app",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://letlogic.app",
  description:
    "AI-powered tenant screening for UK landlords — turn applicant data into a clear risk score, summary, and recommendation in seconds.",
  // Contact & legal entity. TODO: replace placeholders with your registered details.
  email: "hello@letlogic.app",
  supportEmail: "support@letlogic.app",
  privacyEmail: "privacy@letlogic.app",
  company: {
    legalName: "LetLogic Ltd",
    registeredIn: "England and Wales",
    companyNumber: "00000000",
    address: "[Registered office address]",
  },
  // Used as the "Last updated" stamp on legal pages.
  legalUpdated: "17 June 2026",
} as const;
