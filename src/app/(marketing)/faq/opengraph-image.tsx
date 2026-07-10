import { routeOgExports } from "@/lib/seo/og-image";

const og = routeOgExports({
  alt: "LetLogic tenant screening FAQ",
  eyebrow: "Help",
  heading: "Frequently asked questions",
});

export const alt = og.alt;
export const size = og.size;
export const contentType = og.contentType;

export default function Image() {
  return og.render();
}
