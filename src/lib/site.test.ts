import { describe, expect, it } from "vitest";
import { isLegalConfigured } from "./site";

describe("isLegalConfigured", () => {
  it("returns false when placeholder company details are in use", () => {
    // Default env in test runner has no NEXT_PUBLIC_COMPANY_* overrides.
    expect(isLegalConfigured()).toBe(false);
  });
});
