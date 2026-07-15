import { afterEach, describe, expect, it } from "vitest";
import { getSesConfig, isSesConfigured } from "@/lib/email/config";

describe("SES config", () => {
  const keys = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "SES_FROM_EMAIL",
    "SES_FROM_NAME",
  ] as const;

  const previous: Record<string, string | undefined> = {};

  afterEach(() => {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });

  it("is false when credentials are missing", () => {
    for (const key of keys) {
      previous[key] = process.env[key];
      delete process.env[key];
    }
    expect(isSesConfigured()).toBe(false);
    expect(getSesConfig()).toBeNull();
  });

  it("is true when required credentials are set", () => {
    for (const key of keys) {
      previous[key] = process.env[key];
    }
    process.env.AWS_ACCESS_KEY_ID = "AKIATEST";
    process.env.AWS_SECRET_ACCESS_KEY = "secret";
    process.env.SES_FROM_EMAIL = "hello@letlogic.app";

    const config = getSesConfig();
    expect(isSesConfigured()).toBe(true);
    expect(config?.region).toBe("eu-west-1");
    expect(config?.fromEmail).toBe("hello@letlogic.app");
  });
});
