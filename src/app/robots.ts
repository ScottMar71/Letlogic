import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/screen",
          "/screenings/",
          "/properties",
          "/settings",
          "/login",
          "/auth/",
          "/api/",
          "/documents/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
