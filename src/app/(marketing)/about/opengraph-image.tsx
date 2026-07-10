import { routeOgExports } from "@/lib/seo/og-image";

const og = routeOgExports({
  alt: "About LetLogic — fairer tenant screening",
  eyebrow: "About us",
  heading: "Better tenant decisions, without the guesswork",
});

export const alt = og.alt;
export const size = og.size;
export const contentType = og.contentType;

export default function Image() {
  return og.render();
}
