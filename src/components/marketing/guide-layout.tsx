import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { FaqSection } from "@/components/marketing/faq-section";
import {
  JsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  type FaqItem,
} from "@/lib/seo/json-ld";
import { guidePath } from "@/lib/guides";

type GuideLayoutProps = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  /** One-line summary shown under the H1. */
  intro: string;
  /** Prose body — rendered inside a `.legal` container. */
  children: React.ReactNode;
  faqs?: FaqItem[];
};

const READABLE_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

export function GuideLayout({
  slug,
  title,
  description,
  datePublished,
  intro,
  children,
  faqs,
}: GuideLayoutProps) {
  const path = guidePath(slug);
  const published = new Date(datePublished).toLocaleDateString(
    "en-GB",
    READABLE_DATE_OPTIONS,
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <JsonLd
        data={[
          articleJsonLd({ title, description, path, datePublished }),
          breadcrumbJsonLd([
            { name: "Guides", path: "/guides" },
            { name: title, path },
          ]),
        ]}
      />
      <MarketingHeader />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-narrow)] flex-1 px-4 py-12"
      >
        <nav aria-label="Breadcrumb" className="text-sm text-text-subtle">
          <Link href="/guides" className="hover:text-text">
            Guides
          </Link>
          <span aria-hidden> / </span>
          <span className="text-text-muted">{title}</span>
        </nav>

        <header className="mt-4 border-b border-border pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            {title}
          </h1>
          <p className="mt-2 text-text-muted">{intro}</p>
          <p className="mt-3 text-xs text-text-subtle">Published {published}</p>
        </header>

        <article className="legal mt-8">{children}</article>

        {faqs && faqs.length > 0 && (
          <div className="mt-12">
            <FaqSection items={faqs} />
          </div>
        )}

        <section className="mt-12 rounded-2xl border border-brand-700 bg-brand-700 p-6 text-center text-white">
          <h2 className="text-lg font-semibold">Screen with confidence</h2>
          <p className="mt-1 text-sm text-brand-100">
            See an explainable risk score in seconds.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/sample" className="btn-onbrand">
              View a sample report
            </Link>
            <Link href="/tenant-screening" className="btn-onbrand-secondary px-5">
              Screening guide
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
