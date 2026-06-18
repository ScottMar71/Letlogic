import Link from "next/link";
import { Layers, Repeat, Users } from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "Tenant screening for letting agents",
  description:
    "Consistent, explainable tenant screening for UK letting agents — triage applicants across a portfolio at speed, with team seats, API access, and white-label reports.",
  path: "/for-letting-agents",
});

const BENEFITS = [
  {
    icon: Repeat,
    title: "Consistent assessments",
    body: "Every applicant is assessed against the same explainable signals, so your team applies a consistent standard across branches and portfolios.",
  },
  {
    icon: Users,
    title: "Built for teams",
    body: "Team seats and shared history mean negotiators can screen, compare, and hand off applicants without losing context.",
  },
  {
    icon: Layers,
    title: "Fits your workflow",
    body: "API access and white-label reports let you embed screening into your existing process and present results under your own brand.",
  },
];

const FAQS = [
  {
    question: "Do you offer team seats and API access?",
    answer:
      "Yes. Our Agency option adds team seats, API access, and white-label reports. Get in touch and we'll tailor it to your volume.",
  },
  {
    question: "Can reports be white-labelled?",
    answer:
      "Yes — Agency plans support white-label reports so you can present screening results under your own brand to landlords and clients.",
  },
  {
    question: "Is LetLogic a referencing provider?",
    answer:
      "No. LetLogic is an explainable screening aid that complements formal referencing and Right to Rent checks. It helps your team triage applicants quickly before verification.",
  },
];

export default function ForLettingAgentsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "For letting agents", path: "/for-letting-agents" },
        ])}
      />
      <MarketingHeader />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16"
      >
        <section className="space-y-5">
          <p className="section-label">For letting agents</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Screen applicants consistently, at portfolio speed
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            LetLogic gives letting agents an explainable, repeatable way to
            triage tenant applications across many properties — with team seats,
            API access, and white-label reports for higher volumes.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:hello@letlogic.app?subject=LetLogic%20Agency"
              className="btn-primary px-5"
            >
              Talk to us about Agency
            </a>
            <Link href="/sample" className="btn-secondary px-5">
              View a sample report
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="card">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50"
                aria-hidden
              >
                <benefit.icon className="h-5 w-5 text-brand-600" />
              </div>
              <h2 className="mt-3 font-semibold text-text">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {benefit.body}
              </p>
            </div>
          ))}
        </section>

        <FaqSection items={FAQS} />

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white">
          <h2 className="text-xl font-semibold">Tailored to your volume</h2>
          <p className="mt-1 text-brand-100">
            Tell us how many screenings you run and we&apos;ll put together an
            Agency plan.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:hello@letlogic.app?subject=LetLogic%20Agency"
              className="btn-onbrand"
            >
              Contact sales
            </a>
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
