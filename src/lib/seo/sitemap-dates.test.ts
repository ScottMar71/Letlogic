import { describe, expect, it } from "vitest";
import { lastModifiedForPath } from "./sitemap-dates";

describe("lastModifiedForPath", () => {
  it("uses legalUpdated for legal pages", () => {
    const date = lastModifiedForPath("/privacy");
    expect(date.toISOString()).toBe("2026-06-17T12:00:00.000Z");
  });

  it("uses guide datePublished for guide pages", () => {
    const date = lastModifiedForPath("/guides/tenant-vetting");
    expect(date.toISOString().startsWith("2026-06-19")).toBe(true);
  });

  it("uses the latest guide date for the guides hub", () => {
    const date = lastModifiedForPath("/guides");
    expect(date.toISOString().startsWith("2026-06-19")).toBe(true);
  });

  it("uses the marketing fallback for product pages", () => {
    const date = lastModifiedForPath("/pricing");
    expect(date.toISOString().startsWith("2026-06-18")).toBe(true);
  });
});
