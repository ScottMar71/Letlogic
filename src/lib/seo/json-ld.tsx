import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo/routes";
import { CREDIT_PACK_LIST, PRO_PLAN } from "@/lib/screening/pricing";

/** Format a pence amount as a plain decimal string for schema, e.g. 499 -> "4.99". */
function poundsString(pence: number): string {
  return (pence / 100).toFixed(2);
}

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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.supportEmail,
      areaServed: "GB",
      availableLanguage: "English",
    },
    // Only emitted once social profiles are configured (NEXT_PUBLIC_SOCIAL_URLS).
    ...(site.socialUrls.length > 0 ? { sameAs: site.socialUrls } : {}),
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

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${site.name} tenant screening`,
    serviceType: "Tenant screening",
    description: site.description,
    url: absoluteUrl("/how-it-works"),
    provider: {
      "@type": "Organization",
      name: site.company.legalName,
      url: site.url,
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    audience: {
      "@type": "Audience",
      audienceType: "UK landlords and letting agents",
    },
    offers: {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "GBP",
      description: "Pay per screening from £4.99",
    },
  };
}

/**
 * Service schema for the pricing page, with one Offer per credit pack plus the
 * Pro subscription. Uses Service (not Product) — Product snippets require visible
 * aggregateRating/review data we do not have. Prices match `lib/screening/pricing`.
 */
export function pricingJsonLd() {
  const packOffers = CREDIT_PACK_LIST.map((pack) => ({
    "@type": "Offer",
    name: pack.name,
    price: poundsString(pack.pricePence),
    priceCurrency: "GBP",
    category: "One-time purchase",
    url: absoluteUrl("/pricing"),
    availability: "https://schema.org/InStock",
  }));

  const proOffer = {
    "@type": "Offer",
    name: `${PRO_PLAN.name} (monthly subscription)`,
    price: poundsString(PRO_PLAN.pricePence),
    priceCurrency: "GBP",
    category: "Subscription",
    url: absoluteUrl("/pricing"),
    availability: "https://schema.org/InStock",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${site.name} tenant screening`,
    serviceType: "Tenant screening",
    description: site.description,
    url: absoluteUrl("/pricing"),
    provider: {
      "@type": "Organization",
      name: site.company.legalName,
      url: site.url,
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    offers: [...packOffers, proOffer],
  };
}

type Crumb = { name: string; path: string };

/**
 * BreadcrumbList structured data. Always prefixes a "Home" crumb so search
 * engines can render the page's position in the site hierarchy.
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  const items = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

type ArticleOptions = {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
};

/** Article structured data for guide/blog content. */
export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleOptions) {
  const publisher = {
    "@type": "Organization",
    name: site.company.legalName,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/icon.svg"),
    },
  };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    inLanguage: "en-GB",
    author: publisher,
    publisher,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

export type FaqItem = { question: string; answer: string };

/** FAQPage structured data built from visible question/answer pairs. */
export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
