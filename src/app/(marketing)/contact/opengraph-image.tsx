import { routeOgExports } from "@/lib/seo/og-image";

const og = routeOgExports({
  alt: "Contact the LetLogic team",
  eyebrow: "Contact",
  heading: "Get in touch",
});

export const alt = og.alt;
export const size = og.size;
export const contentType = og.contentType;

export default function Image() {
  return og.render();
}
