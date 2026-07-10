import Link from "next/link";
import { Layers, Repeat, Users } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { PRO_PLAN } from "@/lib/screening/pricing";
import { site } from "@/lib/site";

export const metadata = marketingPageMetadata({
  title: "Tenant screening for letting agents",
  description:
    "Consistent, explainable tenant screening for UK letting agents — triage applicants across a portfolio at speed with Pro comparison tools and PDF export.",
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
    title: "Works for small teams today",
    body: "Use Pro for comparison view and PDF export on up to 15 screenings a month, or pay-as-you-go credits when volume is lower.",
  },
  {
    icon: Layers,
    title: "Agency plan coming soon",
    body: "Team seats, API access, and white-label reports are on the roadmap. Register interest and we'll notify you when Agency launches.",
  },
];

const FAQS = [
  {
    question: "Do you offer team seats and API access?",
    answer:
      "Not yet — an Agency plan with team seats, API access, and white-label reports is coming soon. For now, letting agents can use Pro or pay-as-you-go credits. Email hello@letlogic.app to register interest.",
  },
  {
    question: "Can reports be white-labelled?",
    answer:
      "White-label reports will be part of the upcoming Agency plan. Pro includes branded PDF export you can share with landlords today.",
  },
  {
    question: "Is LetLogic a referencing provider?",
    answer:
      "No. LetLogic is an explainable screening aid that complements formal referencing and Right to Rent checks. It helps your team triage applicants quickly before verification.",
  },
];

export default function ForLettingAgentsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "For letting agents", path: "/for-letting-agents" },
        ])}
      />

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
            triage tenant applications across many properties. Start with Pro (
            {PRO_PLAN.monthlyCredits} screenings/month) or pay-as-you-go credits
            — Agency features are coming soon.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pricing" className="btn-primary px-5">
              See pricing
            </Link>
            <Link href="/sample" className="btn-secondary px-5">
              View a sample report
            </Link>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("LetLogic Agency interest")}`}
              className="btn-secondary px-5"
            >
              Register Agency interest
            </a>
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
          <h2 className="text-xl font-semibold">Agency plan — coming soon</h2>
          <p className="mt-1 text-brand-100">
            Team seats, API access, and white-label reports for higher volumes.
            Use Pro or credits while we build it.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("LetLogic Agency interest")}`}
              className="btn-onbrand"
            >
              Register interest
            </a>
            <Link href="/login?next=/screen" className="btn-onbrand-secondary px-5">
              Sign in to screen
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
