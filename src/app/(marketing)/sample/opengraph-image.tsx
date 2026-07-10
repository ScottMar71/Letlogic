import { routeOgExports } from "@/lib/seo/og-image";

const og = routeOgExports({
  alt: "Sample LetLogic tenant screening report",
  eyebrow: "Sample report",
  heading: "See a screening report before you sign up",
});

export const alt = og.alt;
export const size = og.size;
export const contentType = og.contentType;

export default function Image() {
  return og.render();
}
