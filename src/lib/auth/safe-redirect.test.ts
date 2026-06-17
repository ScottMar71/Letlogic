import { describe, expect, it } from "vitest";
import { safeNextPath } from "../request-origin";

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
