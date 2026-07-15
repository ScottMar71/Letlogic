import type { ReactNode } from "react";
import { JsonLd, faqPageJsonLd, type FaqItem } from "@/lib/seo/json-ld";

export type FaqSectionItem = FaqItem & {
  /** Optional rich answer (links). Schema still uses plain `answer` text. */
  answerContent?: ReactNode;
};

type FaqSectionProps = {
  items: FaqSectionItem[];
  /** Heading shown above the list. Pass empty string to hide. */
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

  const schemaItems = items.map(({ question, answer }) => ({
    question,
    answer,
  }));

  return (
    <section
      className="space-y-6"
      aria-labelledby={title ? "faq-heading" : undefined}
    >
      <JsonLd data={faqPageJsonLd(schemaItems)} />
      {(title || intro) && (
        <div className="max-w-2xl space-y-2">
          {title ? (
            <h2 id="faq-heading" className="text-h2 font-bold text-text">
              {title}
            </h2>
          ) : null}
          {intro && <p className="text-sm text-text-muted">{intro}</p>}
        </div>
      )}
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium text-text">
              <span>{item.question}</span>
              <span
                aria-hidden
                className="text-text-subtle transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="mt-3 text-sm leading-relaxed text-text-muted [&_a]:font-medium [&_a]:text-brand-ink [&_a]:underline hover:[&_a]:text-brand-ink-hover">
              {item.answerContent ?? <p>{item.answer}</p>}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
