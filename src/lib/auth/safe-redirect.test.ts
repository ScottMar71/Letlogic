import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  buildAuthCallbackUrl,
  getAuthRedirectOrigin,
  safeNextPath,
} from "../request-origin";

describe("safeNextPath", () => {
  it("allows normal relative paths", () => {
    expect(safeNextPath("/dashboard")).toBe("/dashboard");
    expect(safeNextPath("/properties/abc/compare")).toBe(
      "/properties/abc/compare",
    );
  });

  it("rejects protocol-relative and absolute URLs", () => {
    expect(safeNextPath("//evil.com")).toBe("/");
    expect(safeNextPath("https://evil.com")).toBe("/");
    expect(safeNextPath("@evil.com")).toBe("/");
  });

  it("defaults empty values to home", () => {
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath(undefined)).toBe("/");
    expect(safeNextPath("")).toBe("/");
  });
});

describe("getAuthRedirectOrigin", () => {
  const prev = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = prev;
  });

  it("uses localhost from headers in local dev", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.letlogic.app";
    const origin = getAuthRedirectOrigin({
      get: (name) =>
        ({
          host: "localhost:3000",
          "x-forwarded-host": "localhost:3000",
          "x-forwarded-proto": "http",
        })[name] ?? null,
    });
    expect(origin).toBe("http://localhost:3000");
  });

  it("uses canonical SITE_URL in production", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.letlogic.app";
    const origin = getAuthRedirectOrigin({
      get: (name) =>
        ({
          host: "www.letlogic.app",
          "x-forwarded-host": "www.letlogic.app",
          "x-forwarded-proto": "https",
        })[name] ?? null,
    });
    expect(origin).toBe("https://www.letlogic.app");
  });
});

describe("buildAuthCallbackUrl", () => {
  it("builds callback URL with encoded next path", () => {
    expect(
      buildAuthCallbackUrl("https://www.letlogic.app", "/dashboard"),
    ).toBe("https://www.letlogic.app/auth/callback?next=%2Fdashboard");
  });
});
