import { getGuide } from "@/lib/guides";
import { routeOgExports } from "@/lib/seo/og-image";

const guide = getGuide("right-to-rent")!;

const og = routeOgExports({
  alt: `${guide.title} — LetLogic guide`,
  eyebrow: "Guide",
  heading: guide.title,
});

export const alt = og.alt;
export const size = og.size;
export const contentType = og.contentType;

export default function Image() {
  return og.render();
}
