import { describe, expect, it } from "vitest";
import { isLegalConfigured, site } from "./site";

describe("site legal identity", () => {
  it("defaults to LetLogic as a sole trader", () => {
    expect(site.company.legalName).toBe("LetLogic");
    expect(site.company.entityType).toBe("sole_trader");
  });

  it("treats sole trader with default legal name as configured", () => {
    expect(isLegalConfigured()).toBe(true);
  });
});
