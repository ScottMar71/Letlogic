import Link from "next/link";
import { Banknote, FileCheck2, ShieldCheck, TimerReset } from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "Tenant screening in the UK: a guide",
  description:
    "A practical guide to tenant screening for UK landlords — what to check, how affordability and stability work, and how it differs from a credit check or referencing.",
  path: "/tenant-screening",
});

const CHECKS = [
  {
    icon: Banknote,
    title: "Affordability",
    body: "Compare income to the rent you're charging. A common benchmark is income of at least 2.5–3x the annual rent, but the right multiple depends on the applicant's other commitments.",
  },
  {
    icon: TimerReset,
    title: "Stability",
    body: "Employment type, time in role, and the consistency of income over time. Stable, predictable income usually matters more than a single high figure.",
  },
  {
    icon: FileCheck2,
    title: "References & history",
    body: "Previous landlord references, rental history, and any gaps. These add context that raw numbers can't, so it's worth confirming what's missing.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance checks",
    body: "Right to Rent is a separate legal requirement in England, and formal referencing or credit checks may still be appropriate before you sign.",
  },
];

const FAQS = [
  {
    question: "What is tenant screening?",
    answer:
      "Tenant screening is the process landlords use to assess whether a prospective tenant is likely to sustain a tenancy — primarily by looking at affordability, income stability, rental history, and references before granting a tenancy.",
  },
  {
    question: "What should a UK landlord check before letting?",
    answer:
      "Typically: that income comfortably covers the rent, that employment and income look stable, previous landlord references and rental history, and the legally required Right to Rent check in England. Formal referencing or a credit check may also be appropriate.",
  },
  {
    question: "Is tenant screening the same as a credit check?",
    answer:
      "No. A credit check looks at credit history with a credit-reference agency. Screening is broader — it weighs affordability and stability to judge whether a tenancy is sustainable. LetLogic is a screening aid and does not run credit checks.",
  },
  {
    question: "How can I screen tenants faster?",
    answer:
      "Tools like LetLogic turn an application into an explainable risk score, summary, and suggested follow-up questions in seconds, so you can triage applicants quickly while keeping the final decision yourself.",
  },
];

export default function TenantScreeningPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <JsonLd
        data={[
          serviceJsonLd(),
          breadcrumbJsonLd([
            { name: "Tenant screening", path: "/tenant-screening" },
          ]),
        ]}
      />
      <MarketingHeader />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16"
      >
        <section className="space-y-5">
          <p className="section-label">Guide</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Tenant screening in the UK: a practical guide
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Screening helps you decide whether a prospective tenant is likely to
            sustain a tenancy before you commit. This guide covers what UK
            landlords check, how affordability and stability work, and where
            screening fits alongside referencing and Right to Rent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sample" className="btn-primary px-5">
              View a sample report
            </Link>
            <Link href="/how-it-works" className="btn-secondary px-5">
              How LetLogic works
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 font-bold text-text">What to check</h2>
          <p className="max-w-2xl text-text-muted">
            Good screening focuses on a few signals that genuinely predict a
            sustainable tenancy — and stays fair by avoiding protected
            characteristics.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {CHECKS.map((check) => (
              <div key={check.title} className="card">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50"
                  aria-hidden
                >
                  <check.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="mt-3 font-semibold text-text">{check.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {check.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-h2 font-bold text-text">
            Screening vs credit checks vs referencing
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
            These three are often confused. A{" "}
            <Link
              href="/tenant-screening-vs-credit-check"
              className="text-brand-600 underline hover:text-brand-500"
            >
              credit check
            </Link>{" "}
            looks at credit history; formal{" "}
            <Link
              href="/letlogic-vs-tenant-referencing"
              className="text-brand-600 underline hover:text-brand-500"
            >
              tenant referencing
            </Link>{" "}
            verifies employment, income, and landlord references in depth; and
            screening weighs the overall picture to gauge whether a tenancy is
            likely to be sustainable. They complement each other — screening is
            the fast first pass that tells you what to verify next.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 font-bold text-text">
            Who LetLogic is built for
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/for-landlords" className="card hover:border-brand-300">
              <h3 className="font-semibold text-text">Independent landlords</h3>
              <p className="mt-2 text-sm text-text-muted">
                Triage applicants quickly without formal referencing overhead.
              </p>
            </Link>
            <Link
              href="/for-letting-agents"
              className="card hover:border-brand-300"
            >
              <h3 className="font-semibold text-text">Letting agents</h3>
              <p className="mt-2 text-sm text-text-muted">
                Consistent, explainable assessments across a portfolio.
              </p>
            </Link>
            <Link
              href="/for-hmo-landlords"
              className="card hover:border-brand-300"
            >
              <h3 className="font-semibold text-text">HMO landlords</h3>
              <p className="mt-2 text-sm text-text-muted">
                Compare multiple applicants for the same room or property.
              </p>
            </Link>
          </div>
        </section>

        <FaqSection
          items={FAQS}
          intro="Common questions about tenant screening in the UK."
        />

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white">
          <h2 className="text-xl font-semibold">Screen your next applicant</h2>
          <p className="mt-1 text-brand-100">
            See an explainable risk score in seconds — pay per screening or go
            Pro.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/login?next=/screen" className="btn-onbrand">
              Sign in to screen
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
