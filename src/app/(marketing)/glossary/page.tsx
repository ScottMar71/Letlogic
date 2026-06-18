import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "UK lettings & tenant screening glossary",
  description:
    "Plain-English definitions of UK lettings and tenant screening terms — affordability, income multiple, guarantor, Right to Rent, CCJ, and more for landlords.",
  path: "/glossary",
});

const TERMS: { term: string; definition: React.ReactNode }[] = [
  {
    term: "Affordability",
    definition:
      "Whether a tenant's income comfortably covers the rent and their other commitments. The single biggest predictor of a sustainable tenancy.",
  },
  {
    term: "Income multiple",
    definition:
      "Gross annual income divided by annual rent. Many landlords look for at least 2.5–3x, used as a guide rather than a hard rule.",
  },
  {
    term: "Guarantor",
    definition:
      "A third party who agrees to cover the rent if the tenant cannot. Often used when an applicant's income alone doesn't meet the affordability threshold.",
  },
  {
    term: "Right to Rent",
    definition: (
      <>
        A legal check (England only) that occupiers aged 18+ have the right to
        rent in the UK. Separate from screening — see the{" "}
        <Link href="/guides/right-to-rent">Right to Rent guide</Link>.
      </>
    ),
  },
  {
    term: "CCJ (County Court Judgment)",
    definition:
      "A court ruling that someone owes a debt. CCJs appear on credit files and may surface in a credit check rather than in screening.",
  },
  {
    term: "Tenant referencing",
    definition: (
      <>
        Formal verification of an applicant&apos;s employment, income, and
        previous landlord references. See{" "}
        <Link href="/letlogic-vs-tenant-referencing">
          screening vs referencing
        </Link>
        .
      </>
    ),
  },
  {
    term: "Credit check",
    definition: (
      <>
        A search of an applicant&apos;s credit history with a credit-reference
        agency. See{" "}
        <Link href="/tenant-screening-vs-credit-check">
          screening vs credit check
        </Link>
        .
      </>
    ),
  },
  {
    term: "Tenant screening",
    definition: (
      <>
        Assessing whether a prospective tenant is likely to sustain a tenancy,
        based on affordability and stability. Read the{" "}
        <Link href="/tenant-screening">full guide</Link>.
      </>
    ),
  },
];

export default function GlossaryPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Glossary", path: "/glossary" }])} />

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
          {TERMS.map(({ term, definition }) => (
            <div
              key={term}
              id={term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
              className="px-5 py-4"
            >
              <dt className="font-semibold text-text">{term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-text-muted">
                {definition}
              </dd>
            </div>
          ))}
        </dl>
      </main>

    </>
  );
}
