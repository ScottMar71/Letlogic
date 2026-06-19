const DEFAULT_CONTACT_INBOX = "scott.maryan@icloud.com";

/** Private inbox for contact form submissions and inbound @letlogic.app mail. */
export function getContactInboxEmail(): string {
  const configured = process.env.CONTACT_INBOX_EMAIL?.trim();
  return configured && configured.length > 0
    ? configured
    : DEFAULT_CONTACT_INBOX;
}
