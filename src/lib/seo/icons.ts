import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Favicon and install icon metadata — spread into every page export. */
export const siteIconsMetadata = {
  icons: {
    icon: [
      { url: site.icons.icon, type: "image/svg+xml" },
      { url: site.icons.png, type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: site.icons.apple, sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
} satisfies Pick<Metadata, "icons" | "manifest">;
