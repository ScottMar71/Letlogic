import { FaqSection, type FaqSectionItem } from "@/components/marketing/faq-section";
import { MarketingCtaBand } from "@/components/marketing/marketing-cta-band";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { formatDateLong } from "@/lib/format-date";
import { getGuide, guidePath } from "@/lib/guides";
import {
  JsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo/json-ld";

type GuideLayoutProps = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  /** One-line summary shown under the H1. */
  intro: string;
  /** Optional in-article table of contents. */
  toc?: { id: string; label: string }[];
  /** Prose body — rendered inside a `.legal` container. */
  children: React.ReactNode;
  faqs?: FaqSectionItem[];
};

export function GuideLayout({
  slug,
  title,
  description,
  datePublished,
  intro,
  toc,
  children,
  faqs,
}: GuideLayoutProps) {
  const path = guidePath(slug);
  const guide = getGuide(slug);
  const dateModified = guide?.dateModified;
  const published = formatDateLong(datePublished);
  const updated =
    dateModified && dateModified !== datePublished
      ? formatDateLong(dateModified)
      : null;

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title,
            description,
            path,
            datePublished,
            dateModified,
          }),
          breadcrumbJsonLd([
            { name: "Guides", path: "/guides" },
            { name: title, path },
          ]),
        ]}
      />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-narrow)] flex-1 px-4 py-12"
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: title },
          ]}
        />

        <header className="mt-4 border-b border-border pb-6">
          <h1 className="text-display font-bold tracking-tight text-text">
            {title}
          </h1>
          <p className="mt-2 text-lg text-text-muted">{intro}</p>
          <p className="mt-3 text-xs text-text-subtle">
            Published {published}
            {updated ? ` · Updated ${updated}` : ""}
          </p>
        </header>

        {toc && toc.length > 0 ? (
          <nav
            aria-label="On this page"
            className="mt-6 rounded-xl border border-border bg-surface p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
              On this page
            </p>
            <ol className="mt-2 space-y-1.5">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm font-medium text-brand-ink underline hover:text-brand-ink-hover"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <article className="legal mt-8">{children}</article>

        {faqs && faqs.length > 0 && (
          <div className="mt-12">
            <FaqSection items={faqs} />
          </div>
        )}

        <MarketingCtaBand
          className="mt-12"
          title="Screen with confidence"
          description="See an explainable risk score in seconds."
          primaryHref="/sample"
          primaryLabel="View a sample report"
          secondaryHref="/pricing"
          secondaryLabel="See pricing"
        />
      </main>
    </>
  );
}
