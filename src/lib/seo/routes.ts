import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { GUIDES, guidePath } from "@/lib/guides";

/** Marketing routes that should be indexed. */
export const PUBLIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/tenant-screening", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.8 },
  { path: "/sample", changeFrequency: "monthly", priority: 0.8 },
  {
    path: "/tenant-screening-vs-credit-check",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/letlogic-vs-tenant-referencing",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/for-landlords", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for-letting-agents", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for-hmo-landlords", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/guides", changeFrequency: "monthly", priority: 0.7 },
  ...GUIDES.map((guide) => ({
    path: guidePath(guide.slug),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
  { path: "/glossary", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
