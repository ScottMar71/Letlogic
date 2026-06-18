import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "Tenant screening vs credit check",
  description:
    "How tenant screening differs from a credit check for UK landlords — what each one tells you, where they overlap, and how to decide which you need before letting.",
  path: "/tenant-screening-vs-credit-check",
});

const COLUMNS = ["LetLogic screening", "Credit check"];

const ROWS = [
  { label: "Assesses affordability vs rent", values: [true, "partial"] as const },
  { label: "Weighs income stability", values: [true, false] as const },
  { label: "Shows credit history / CCJs", values: [false, true] as const },
  { label: "Explainable, plain-English summary", values: [true, false] as const },
  { label: "Suggests follow-up questions", values: [true, false] as const },
  { label: "Result in seconds", values: [true, "partial"] as const },
  { label: "Hard search on credit file", values: [false, "partial"] as const },
];

const FAQS = [
  {
    question: "Do I need a credit check if I use tenant screening?",
    answer:
      "They answer different questions. Screening tells you whether a tenancy looks affordable and stable; a credit check shows credit history and adverse markers like CCJs. Many landlords use screening to triage, then run a credit check or formal referencing before signing.",
  },
  {
    question: "Does LetLogic run a credit check?",
    answer:
      "No. LetLogic is an explainable screening aid and does not search credit-reference agency data or perform a hard credit search. It assesses the application you provide.",
  },
  {
    question: "Which is better for spotting risk?",
    answer:
      "Neither alone is complete. A credit check surfaces past credit problems; screening surfaces affordability and stability risk for this tenancy. Used together they give a fuller picture.",
  },
];

export default function ScreeningVsCreditCheckPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Tenant screening", path: "/tenant-screening" },
          {
            name: "vs credit check",
            path: "/tenant-screening-vs-credit-check",
          },
        ])}
      />
      <MarketingHeader />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-12 px-4 py-16"
      >
        <section className="space-y-5">
          <p className="section-label">Comparison</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Tenant screening vs a credit check
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            They&apos;re often confused, but they answer different questions. A
            credit check looks backwards at credit history; tenant screening
            looks at whether <em>this</em> tenancy is affordable and stable.
            Here&apos;s how they compare and when to use each.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-h2 font-bold text-text">At a glance</h2>
          <ComparisonTable
            caption="Comparison of LetLogic tenant screening and a standard credit check"
            columns={COLUMNS}
            rows={ROWS.map((r) => ({ label: r.label, values: [...r.values] }))}
          />
          <p className="text-xs text-text-subtle">
            LetLogic is a screening aid, not a credit check, referencing report,
            or legal advice.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-text">
              When screening helps most
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Early on, when you&apos;re comparing several applicants and need a
              fast, explainable read on affordability and stability before
              spending on formal checks.
            </p>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold text-text">
              When a credit check helps most
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Later in the process, to confirm credit history and surface
              adverse markers like CCJs or defaults before you sign a tenancy
              agreement.
            </p>
          </div>
        </section>

        <FaqSection items={FAQS} />

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white">
          <h2 className="text-xl font-semibold">See screening in action</h2>
          <p className="mt-1 text-brand-100">
            View a sample report, or read the full{" "}
            <Link href="/tenant-screening" className="underline">
              tenant screening guide
            </Link>
            .
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

      <MarketingFooter />
    </div>
  );
}
