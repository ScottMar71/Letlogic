import {
  SESv2Client,
  SendEmailCommand,
  type SendEmailCommandInput,
} from "@aws-sdk/client-sesv2";
import { getSesConfig, isSesConfigured } from "@/lib/email/config";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Optional idempotency key for retries (SES does not dedupe; for our logs). */
  messageTag?: string;
};

export type SendEmailResult =
  | { ok: true; messageId: string | undefined }
  | { ok: false; error: string; skipped?: boolean };

let client: SESv2Client | null = null;

function getClient(): SESv2Client | null {
  const config = getSesConfig();
  if (!config) return null;

  client ??= new SESv2Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return client;
}

/** Send a transactional email via Amazon SES. No-op when SES is not configured. */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!isSesConfigured()) {
    return { ok: false, error: "SES is not configured", skipped: true };
  }

  const config = getSesConfig()!;
  const ses = getClient();
  if (!ses) {
    return { ok: false, error: "SES client unavailable", skipped: true };
  }

  const from = `${config.fromName} <${config.fromEmail}>`;
  const params: SendEmailCommandInput = {
    FromEmailAddress: from,
    Destination: { ToAddresses: [input.to] },
    Content: {
      Simple: {
        Subject: { Data: input.subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: input.html, Charset: "UTF-8" },
          Text: { Data: input.text, Charset: "UTF-8" },
        },
      },
    },
    ...(input.messageTag
      ? {
          EmailTags: [{ Name: "type", Value: input.messageTag }],
        }
      : {}),
  };

  try {
    const result = await ses.send(new SendEmailCommand(params));
    return { ok: true, messageId: result.MessageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "SES send failed";
    return { ok: false, error: message };
  }
}
