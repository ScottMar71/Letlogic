import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/routes";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0F1C2E",
    theme_color: "#0F1C2E",
    icons: [
      {
        src: absoluteUrl(site.icons.icon),
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: absoluteUrl(site.icons.png),
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: absoluteUrl(site.icons.apple),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
