import Link from "next/link";
import {
  JsonLd,
  breadcrumbJsonLd,
  definedTermSetJsonLd,
} from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { GLOSSARY_TERMS } from "@/lib/glossary";
import { absoluteUrl } from "@/lib/seo/routes";

export const metadata = marketingPageMetadata({
  title: "UK lettings & tenant screening glossary",
  description:
    "Plain-English definitions of UK lettings and tenant screening terms — affordability, income multiple, guarantor, Right to Rent, CCJ, and more for landlords.",
  path: "/glossary",
});

const RICH_DEFINITIONS: Partial<
  Record<(typeof GLOSSARY_TERMS)[number]["slug"], React.ReactNode>
> = {
  "right-to-rent": (
    <>
      A legal check (England only) that occupiers aged 18+ have the right to
      rent in the UK. Separate from screening — see the{" "}
      <Link href="/guides/right-to-rent">Right to Rent guide</Link>.
    </>
  ),
  "tenant-referencing": (
    <>
      Formal verification of an applicant&apos;s employment, income, and
      previous landlord references. See{" "}
      <Link href="/letlogic-vs-tenant-referencing">
        screening vs referencing
      </Link>
      .
    </>
  ),
  "credit-check": (
    <>
      A search of an applicant&apos;s credit history with a credit-reference
      agency. See{" "}
      <Link href="/tenant-screening-vs-credit-check">
        screening vs credit check
      </Link>
      .
    </>
  ),
  "tenant-screening": (
    <>
      Assessing whether a prospective tenant is likely to sustain a tenancy,
      based on affordability and stability. Read the{" "}
      <Link href="/tenant-screening">full guide</Link>.
    </>
  ),
};

export default function GlossaryPage() {
  const schemaTerms = GLOSSARY_TERMS.map((entry) => ({
    term: entry.term,
    definition: entry.definition,
    url: absoluteUrl(`/glossary#${entry.slug}`),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Glossary", path: "/glossary" }]),
          definedTermSetJsonLd(schemaTerms),
        ]}
      />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-8 px-4 py-16"
      >
        <section className="space-y-3">
          <p className="section-label">Reference</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Tenant screening glossary
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Plain-English definitions of the UK lettings and tenant screening
            terms landlords come across most.
          </p>
        </section>

        <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {GLOSSARY_TERMS.map(({ slug, term, definition }) => (
            <div key={slug} id={slug} className="px-5 py-4">
              <dt className="font-semibold text-text">{term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-text-muted">
                {RICH_DEFINITIONS[slug] ?? definition}
              </dd>
            </div>
          ))}
        </dl>
      </main>
    </>
  );
}
