import { routeOgExports } from "@/lib/seo/og-image";

const og = routeOgExports({
  alt: "Tenant screening guides for UK landlords",
  eyebrow: "Resources",
  heading: "Guides for UK landlords",
});

export const alt = og.alt;
export const size = og.size;
export const contentType = og.contentType;

export default function Image() {
  return og.render();
}
