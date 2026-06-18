import Link from "next/link";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "LetLogic FAQ — tenant screening questions",
  description:
    "Answers to common questions about LetLogic tenant screening — what it is, what it isn't, pricing, fairness, data handling, and how it fits your letting process.",
  path: "/faq",
});

const FAQS = [
  {
    question: "What is LetLogic?",
    answer:
      "LetLogic is an AI-powered tenant screening aid for UK landlords. It turns a tenant application into an explainable risk score, a plain-English summary, and suggested follow-up questions in seconds.",
  },
  {
    question: "What is LetLogic not?",
    answer:
      "It is not a credit check, a credit-reference agency service, a formal tenant-referencing report, a Right to Rent check, or legal advice. It's a decision aid — you remain the decision-maker.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Screenings start from £4.99 on pay-as-you-go credit packs, or you can subscribe to Pro for a monthly allowance plus a reduced per-screening rate. See the pricing page for current packs and the Pro plan.",
  },
  {
    question: "Is it fair and Equality Act aware?",
    answer:
      "LetLogic is designed to focus on affordability and stability rather than protected characteristics, and it never makes automated decisions about people. You stay in control of every letting decision.",
  },
  {
    question: "How is applicant data handled?",
    answer:
      "We collect the minimum needed, are transparent about sub-processors, and put you in control of applicant data. See the Privacy Policy for full detail on UK GDPR roles and retention.",
  },
  {
    question: "Does it work for letting agents and HMOs?",
    answer:
      "Yes. There are tailored options for letting agents (team seats, API access, white-label reports) and HMO landlords (comparing multiple applicants for the same room).",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. Paste the applicant's details — an email, a form, or notes — and LetLogic returns an assessment. There's no setup or integration required.",
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "FAQ", path: "/faq" }])} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-10 px-4 py-16"
      >
        <section className="space-y-3">
          <p className="section-label">Help</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Frequently asked questions
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            The essentials about LetLogic. For more depth, see{" "}
            <Link
              href="/how-it-works"
              className="text-brand-600 underline hover:text-brand-500"
            >
              how it works
            </Link>{" "}
            or our{" "}
            <Link
              href="/guides"
              className="text-brand-600 underline hover:text-brand-500"
            >
              guides
            </Link>
            .
          </p>
        </section>

        <FaqSection items={FAQS} title="Common questions" />
      </main>

    </>
  );
}
