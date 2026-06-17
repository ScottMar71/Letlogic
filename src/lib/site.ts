export const site = {
  name: "LetLogic",
  domain: "letlogic.app",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://letlogic.app",
  description:
    "AI compliance assistant for UK landlords — documents, reminders, and deadlines.",
} as const;
