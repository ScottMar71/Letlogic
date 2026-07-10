import { GUIDES, getGuide } from "@/lib/guides";
import { site } from "@/lib/site";

const LEGAL_PATHS = new Set(["/privacy", "/terms", "/cookies"]);

/** Fallback for core marketing pages without a page-specific date. */
const MARKETING_CONTENT_UPDATED = "2026-06-18";

/** Parse ISO or UK long-form dates without timezone drift in sitemap output. */
function parseContentDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00.000Z`);
  }
  const parsed = new Date(`${value} 12:00:00 GMT`);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return new Date(MARKETING_CONTENT_UPDATED);
}

/** Content-aware lastModified for sitemap entries. */
export function lastModifiedForPath(path: string): Date {
  if (LEGAL_PATHS.has(path)) {
    return parseContentDate(site.legalUpdated);
  }

  if (path === "/guides") {
    const timestamps = GUIDES.map((guide) =>
      parseContentDate(guide.datePublished).getTime(),
    );
    return new Date(Math.max(...timestamps));
  }

  if (path.startsWith("/guides/")) {
    const slug = path.slice("/guides/".length);
    const guide = getGuide(slug);
    if (guide) return parseContentDate(guide.datePublished);
  }

  return parseContentDate(MARKETING_CONTENT_UPDATED);
}
