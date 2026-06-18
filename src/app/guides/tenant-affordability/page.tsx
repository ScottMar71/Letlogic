import Link from "next/link";
import { GuideLayout } from "@/components/marketing/guide-layout";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { getGuide, guidePath } from "@/lib/guides";

const guide = getGuide("tenant-affordability")!;

export const metadata = marketingPageMetadata({
  title: "How to assess tenant affordability",
  description: guide.description,
  path: guidePath(guide.slug),
});

const FAQS = [
  {
    question: "What income multiple should a landlord use?",
    answer:
      "A common rule of thumb is that gross annual income should be at least 2.5–3x the annual rent. It's a starting point, not a hard rule — an applicant with low other commitments may be comfortable at a lower multiple, while someone with high outgoings may not be at a higher one.",
  },
  {
    question: "What counts as income for affordability?",
    answer:
      "Usually regular, evidenced income: employment salary, self-employed profit, pensions, and in some cases reliable benefits or a guarantor's income. The key is that it's stable and can be evidenced with payslips, accounts, or bank statements.",
  },
  {
    question: "Is affordability the most important factor?",
    answer:
      "It's the single biggest predictor of a sustainable tenancy, but it works best alongside stability (how secure the income is) and references. Affordability tells you whether the rent fits; stability tells you whether it will keep fitting.",
  },
];

export default function TenantAffordabilityGuide() {
  return (
    <GuideLayout
      slug={guide.slug}
      title={guide.title}
      description={guide.description}
      datePublished={guide.datePublished}
      intro="How to judge whether a tenant can comfortably afford the rent — and keep affording it."
      faqs={FAQS}
    >
      <p>
        Affordability is the foundation of a sustainable tenancy. If the rent is
        a stretch from day one, even a well-intentioned tenant can fall behind
        when circumstances change. This guide explains how UK landlords assess
        affordability in practice.
      </p>

      <h2>The income multiple</h2>
      <p>
        The most common approach compares the applicant&apos;s gross annual
        income to the annual rent. Many landlords look for income of at least{" "}
        <strong>2.5 to 3 times the annual rent</strong>. For example, on rent of
        £1,000 a month (£12,000 a year), a 3x multiple implies income of around
        £36,000.
      </p>
      <p>
        Treat the multiple as a guide rather than a pass/fail gate. Someone with
        no other debts may manage comfortably below it, while someone with
        significant outgoings may struggle above it.
      </p>

      <h2>What counts as income</h2>
      <ul>
        <li>Employment salary (evidenced with payslips)</li>
        <li>Self-employed profit (evidenced with accounts or SA302s)</li>
        <li>Pensions and other regular, reliable income</li>
        <li>A guarantor&apos;s income, where one is offered</li>
      </ul>
      <p>
        Whatever the source, the key test is whether it is stable and can be
        evidenced. One-off or irregular payments shouldn&apos;t be treated as
        dependable income.
      </p>

      <h2>Beyond the headline number</h2>
      <p>
        Affordability isn&apos;t just the multiple. Consider the applicant&apos;s
        other commitments, how secure the income is, and whether there are gaps
        or inconsistencies to ask about. This is where{" "}
        <Link href="/tenant-screening">tenant screening</Link> helps — it weighs
        affordability and stability together and flags what&apos;s missing.
      </p>

      <h2>How LetLogic helps</h2>
      <p>
        LetLogic calculates the income multiple and assesses stability from the
        application you provide, then explains the result in plain English and
        suggests the documents to request. It&apos;s a fast first pass — you can
        see how it reads an example on the{" "}
        <Link href="/sample">sample report</Link>.
      </p>
    </GuideLayout>
  );
}
