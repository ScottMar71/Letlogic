import { describe, expect, it } from "vitest";
import { siteIconsMetadata } from "./icons";
import { privatePageMetadata, marketingPageMetadata } from "./metadata";

describe("siteIconsMetadata", () => {
  it("declares SVG, PNG, ICO, and Apple touch icons", () => {
    const icons = siteIconsMetadata.icons;
    expect(icons).toBeDefined();
    expect(icons?.icon).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "/brand/icon.svg", type: "image/svg+xml" }),
        expect.objectContaining({ url: "/icon.png", type: "image/png" }),
        expect.objectContaining({ url: "/favicon.ico" }),
      ]),
    );
    expect(icons?.shortcut).toBe("/favicon.ico");
    expect(icons?.apple).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "/apple-icon", sizes: "180x180" }),
      ]),
    );
    expect(siteIconsMetadata.manifest).toBe("/manifest.webmanifest");
  });

  it("is included in private and marketing page metadata", () => {
    expect(privatePageMetadata("Dashboard").icons).toEqual(
      siteIconsMetadata.icons,
    );
    expect(
      marketingPageMetadata({
        title: "Pricing",
        description: "Plans",
        path: "/pricing",
      }).icons,
    ).toEqual(siteIconsMetadata.icons);
  });
});
