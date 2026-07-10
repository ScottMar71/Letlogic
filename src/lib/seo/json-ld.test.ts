import { describe, expect, it } from "vitest";
import { CREDIT_PACK_LIST } from "@/lib/screening/pricing";
import {
  definedTermSetJsonLd,
  itemListJsonLd,
  pricingJsonLd,
  serviceJsonLd,
  softwareApplicationJsonLd,
} from "./json-ld";

function entryPriceString(): string {
  const minPence = Math.min(...CREDIT_PACK_LIST.map((pack) => pack.pricePence));
  return (minPence / 100).toFixed(2);
}

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

describe("entry screening offers", () => {
  it("softwareApplicationJsonLd uses the lowest pack price", () => {
    const data = softwareApplicationJsonLd();
    const offer = data.offers as { price: string };
    expect(offer.price).toBe(entryPriceString());
  });

  it("serviceJsonLd uses the lowest pack price", () => {
    const data = serviceJsonLd();
    const offer = data.offers as { price: string };
    expect(offer.price).toBe(entryPriceString());
  });
});

describe("definedTermSetJsonLd", () => {
  it("emits a DefinedTerm per entry", () => {
    const data = definedTermSetJsonLd([
      { term: "Affordability", definition: "Whether rent is sustainable." },
    ]);
    expect(data["@type"]).toBe("DefinedTermSet");
    const terms = data.hasDefinedTerm as { name: string }[];
    expect(terms).toHaveLength(1);
    expect(terms[0]?.name).toBe("Affordability");
  });
});

describe("itemListJsonLd", () => {
  it("emits ordered ListItems with absolute URLs", () => {
    const data = itemListJsonLd([
      { name: "Guide one", path: "/guides/example", description: "Summary" },
    ]);
    expect(data["@type"]).toBe("ItemList");
    const items = data.itemListElement as { position: number; url: string }[];
    expect(items[0]?.position).toBe(1);
    expect(items[0]?.url).toBe("https://www.letlogic.app/guides/example");
  });
});
