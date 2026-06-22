import { describe, expect, it } from "vitest";
import { pricingJsonLd } from "./json-ld";

describe("pricingJsonLd", () => {
  it("uses Service schema so Product snippet review fields are not required", () => {
    const data = pricingJsonLd();
    expect(data["@type"]).toBe("Service");
    expect(data).not.toHaveProperty("aggregateRating");
    expect(data).not.toHaveProperty("review");
  });

  it("includes an offer per credit pack plus Pro", () => {
    const data = pricingJsonLd();
    const offers = data.offers as { name: string }[];
    expect(offers.length).toBeGreaterThanOrEqual(2);
    expect(offers.some((o) => o.name.includes("Pro"))).toBe(true);
  });
});
