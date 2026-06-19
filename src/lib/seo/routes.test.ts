import { describe, expect, it } from "vitest";
import { PUBLIC_ROUTES, absoluteUrl, canonicalPath } from "./routes";

describe("canonicalPath", () => {
  it("normalizes root", () => {
    expect(canonicalPath("/")).toBe("/");
    expect(canonicalPath("")).toBe("/");
  });

  it("strips trailing slashes", () => {
    expect(canonicalPath("/pricing/")).toBe("/pricing");
    expect(canonicalPath("pricing/")).toBe("/pricing");
  });

  it("adds a leading slash", () => {
    expect(canonicalPath("pricing")).toBe("/pricing");
  });
});

describe("absoluteUrl", () => {
  it("uses www origin without trailing slash on root", () => {
    expect(absoluteUrl("/")).toBe("https://www.letlogic.app");
  });

  it("builds path URLs without trailing slash", () => {
    expect(absoluteUrl("/pricing")).toBe("https://www.letlogic.app/pricing");
    expect(absoluteUrl("/pricing/")).toBe("https://www.letlogic.app/pricing");
  });

  it("matches every public route path", () => {
    for (const { path } of PUBLIC_ROUTES) {
      const url = absoluteUrl(path);
      expect(url).toMatch(/^https:\/\/www\.letlogic\.app/);
      expect(url.endsWith("/")).toBe(false);
      if (path === "/") {
        expect(url).toBe("https://www.letlogic.app");
      } else {
        expect(url).toBe(`https://www.letlogic.app${canonicalPath(path)}`);
      }
    }
  });
});
