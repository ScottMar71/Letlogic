import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Favicon / install icon metadata.
 * File conventions also ship icons from `src/app`:
 * - favicon.ico (brand multi-size)
 * - icon.svg / icon.png
 * - apple-icon.tsx → /apple-icon
 * Keep metadata aligned so HTML never points at stale Create-Next-App assets.
 */
export const siteIconsMetadata = {
  icons: {
    icon: [
      // Prefer SVG/PNG brand marks; ICO last for legacy agents.
      { url: site.icons.icon, type: "image/svg+xml" },
      { url: site.icons.png, type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: site.icons.apple, sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
} satisfies Pick<Metadata, "icons" | "manifest">;
