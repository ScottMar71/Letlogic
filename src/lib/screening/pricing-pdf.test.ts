import { describe, expect, it } from "vitest";
import { CREDIT_PACKS, CREDIT_PACK_LIST } from "@/lib/screening/pricing";

describe("PDF export entitlements (pricing)", () => {
  it("does not include PDF on a single screening", () => {
    expect(CREDIT_PACKS.single.includesPdfExport).toBe(false);
  });

  it("includes PDF on multi-credit packs", () => {
    expect(CREDIT_PACKS.pack5.includesPdfExport).toBe(true);
    expect(CREDIT_PACKS.pack20.includesPdfExport).toBe(true);
  });

  it("filters unlock packs to PDF-capable SKUs only", () => {
    const pdfPacks = CREDIT_PACK_LIST.filter((pack) => pack.includesPdfExport);
    expect(pdfPacks.map((p) => p.slug)).toEqual(["pack5", "pack20"]);
  });
});
