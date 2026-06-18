import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo/routes";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.company.legalName,
    url: site.url,
    logo: absoluteUrl("/brand/icon.svg"),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.company.address,
      addressCountry: "GB",
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-GB",
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: site.description,
    url: site.url,
    offers: {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "GBP",
      description: "Pay per screening from £4.99",
    },
  };
}
