import { site } from "@/lib/site";

function env(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : undefined;
}

export type SesConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  fromEmail: string;
  fromName: string;
};

/** True when SES credentials and sender are set (outbound app email). */
export function isSesConfigured(): boolean {
  return getSesConfig() != null;
}

export function getSesConfig(): SesConfig | null {
  const accessKeyId = env("AWS_ACCESS_KEY_ID");
  const secretAccessKey = env("AWS_SECRET_ACCESS_KEY");
  const fromEmail = env("SES_FROM_EMAIL") ?? site.email;

  if (!accessKeyId || !secretAccessKey || !fromEmail) return null;

  return {
    region: env("AWS_REGION") ?? "eu-west-1",
    accessKeyId,
    secretAccessKey,
    fromEmail,
    fromName: env("SES_FROM_NAME") ?? site.name,
  };
}
