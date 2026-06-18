import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og-image";

export const alt = "Tenant screening for HMO landlords";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "For HMO landlords",
    heading: "Screen and compare every applicant",
  });
}
