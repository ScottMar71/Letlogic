import Link from "next/link";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "LetLogic vs tenant referencing",
  description:
    "LetLogic screening vs formal tenant referencing for UK landlords — speed, cost, and depth compared, and why screening complements rather than replaces referencing.",
  path: "/letlogic-vs-tenant-referencing",
});

const COLUMNS = ["LetLogic screening", "Formal referencing"];

const ROWS = [
  { label: "Result in seconds", values: [true, false] as const },
  { label: "Verifies employer / income with third parties", values: [false, true] as const },
  { label: "Contacts previous landlords", values: [false, true] as const },
  { label: "Explainable affordability & stability read", values: [true, "partial"] as const },
  { label: "No applicant wait or forms to complete", values: [true, false] as const },
  { label: "Suitable as a fast first pass", values: [true, false] as const },
  { label: "Provides a verified report for sign-off", values: [false, true] as const },
];

const FAQS = [
  {
    question: "Does LetLogic replace tenant referencing?",
    answer:
      "No. LetLogic complements referencing — it's a fast first pass that helps you triage applicants and decide what to verify. Formal referencing independently verifies employment, income, and landlord references before you sign.",
  },
  {
    question: "Why use screening before referencing?",
    answer:
      "Referencing takes time and money and usually involves the applicant. Screening gives you an instant, explainable read on affordability and stability so you only progress the applicants worth referencing.",
  },
  {
    question: "Is screening enough on its own?",
    answer:
      "For an early decision it can be, but for higher-value or higher-risk tenancies most landlords still complete formal referencing and a Right to Rent check before granting a tenancy.",
  },
];

export default function LetLogicVsReferencingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Tenant screening", path: "/tenant-screening" },
          {
            name: "vs tenant referencing",
            path: "/letlogic-vs-tenant-referencing",
          },
        ])}
      />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-12 px-4 py-16"
      >
        <section className="space-y-5">
          <p className="section-label">Comparison</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            LetLogic vs formal tenant referencing
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Referencing verifies an applicant in depth; LetLogic gives you an
            instant, explainable read so you know who&apos;s worth referencing.
            They work best together — here&apos;s how they compare.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-h2 font-bold text-text">At a glance</h2>
          <ComparisonTable
            caption="Comparison of LetLogic screening and formal tenant referencing"
            columns={COLUMNS}
            rows={ROWS.map((r) => ({ label: r.label, values: [...r.values] }))}
          />
          <p className="text-xs text-text-subtle">
            LetLogic is a screening aid, not a referencing report or legal
            advice.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-h2 font-bold text-text">
            A sensible workflow
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-text-muted">
            <li>
              <span className="font-medium text-text">1. Screen.</span> Paste
              each application into LetLogic and compare the explainable risk
              reads.
            </li>
            <li>
              <span className="font-medium text-text">2. Shortlist.</span>{" "}
              Progress the applicants whose affordability and stability stack up.
            </li>
            <li>
              <span className="font-medium text-text">3. Reference & verify.</span>{" "}
              Run formal referencing and a Right to Rent check before granting
              the tenancy.
            </li>
          </ol>
        </section>

        <FaqSection items={FAQS} />

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white">
          <h2 className="text-xl font-semibold">Try the fast first pass</h2>
          <p className="mt-1 text-brand-100">
            Read the full{" "}
            <Link href="/tenant-screening" className="underline">
              tenant screening guide
            </Link>{" "}
            or see a sample report.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/sample" className="btn-onbrand">
              View a sample report
            </Link>
            <Link href="/pricing" className="btn-onbrand-secondary px-5">
              See pricing
            </Link>
          </div>
        </section>
      </main>

    </>
  );
}
