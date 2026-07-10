import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, absoluteUrl } from "@/lib/seo/routes";
import { lastModifiedForPath } from "@/lib/seo/sitemap-dates";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified: lastModifiedForPath(path),
    changeFrequency,
    priority,
  }));
}
