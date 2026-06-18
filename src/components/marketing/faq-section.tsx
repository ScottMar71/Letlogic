import { JsonLd, faqPageJsonLd, type FaqItem } from "@/lib/seo/json-ld";

type FaqSectionProps = {
  items: FaqItem[];
  /** Heading shown above the list. */
  title?: string;
  /** Optional supporting copy under the heading. */
  intro?: string;
};

/**
 * Accessible, zero-JS FAQ list built on native <details>/<summary> elements,
 * plus matching FAQPage structured data for rich results.
 */
export function FaqSection({
  items,
  title = "Frequently asked questions",
  intro,
}: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-6" aria-labelledby="faq-heading">
      <JsonLd data={faqPageJsonLd(items)} />
      <div className="max-w-2xl space-y-2">
        <h2 id="faq-heading" className="text-h2 font-bold text-text">
          {title}
        </h2>
        {intro && <p className="text-text-muted">{intro}</p>}
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-text">
              <span>{item.question}</span>
              <span
                aria-hidden
                className="text-text-subtle transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
