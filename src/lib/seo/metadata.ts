import type { Metadata } from "next";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo/routes";

/** App and auth routes — never index. */
export const privatePageRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};

export function privatePageMetadata(title: string): Metadata {
  return {
    title,
    robots: privatePageRobots,
  };
}

type MarketingMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

export function marketingPageMetadata({
  title,
  description,
  path,
}: MarketingMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: site.name,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
