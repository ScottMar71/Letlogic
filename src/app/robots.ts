import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/screen",
          "/screenings/",
          "/properties",
          "/settings",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/auth/",
          "/api/",
          "/documents/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
