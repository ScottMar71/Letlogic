import { describe, expect, it, vi, afterEach } from "vitest";
import {
  captchaRequired,
  checkCaptchaToken,
  readCaptchaToken,
} from "./captcha";

describe("captcha helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not require a token when Turnstile is not configured", () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    expect(captchaRequired()).toBe(false);

    const formData = new FormData();
    expect(checkCaptchaToken(formData)).toEqual({ ok: true, token: undefined });
  });

  it("requires a token when Turnstile is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
    expect(captchaRequired()).toBe(true);

    const missing = new FormData();
    expect(checkCaptchaToken(missing)).toEqual({
      ok: false,
      error: "Please complete the security check and try again.",
    });

    const formData = new FormData();
    formData.set("captchaToken", "  token-123  ");
    expect(readCaptchaToken(formData)).toBe("token-123");
    expect(checkCaptchaToken(formData)).toEqual({ ok: true, token: "token-123" });
  });
});
