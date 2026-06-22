/** Cloudflare Turnstile site key (public). When set, auth forms require a token. */
export function turnstileSiteKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key || undefined;
}

export function captchaRequired(): boolean {
  return Boolean(turnstileSiteKey());
}

export function readCaptchaToken(formData: FormData): string | undefined {
  const token = (formData.get("captchaToken") as string | null)?.trim();
  return token || undefined;
}

export type CaptchaCheck =
  | { ok: true; token: string | undefined }
  | { ok: false; error: string };

/** Require a Turnstile token when the site key is configured. */
export function checkCaptchaToken(formData: FormData): CaptchaCheck {
  if (!captchaRequired()) {
    return { ok: true, token: undefined };
  }

  const token = readCaptchaToken(formData);
  if (!token) {
    return {
      ok: false,
      error: "Please complete the security check and try again.",
    };
  }

  return { ok: true, token };
}
