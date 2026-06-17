import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata = {
  title: "How it works",
  description:
    "How LetLogic turns a tenant application into an explainable risk score, summary, and recommendation in seconds.",
};

const STEPS = [
  {
    title: "Paste the application",
    body: "Drop in the applicant's details — an email, an online form, or your own notes. There's no setup, integration, or template to learn.",
  },
  {
    title: "We analyse the signals",
    body: "LetLogic reads the income, employment stability, and affordability against the rent, then weighs the things landlords actually worry about.",
  },
  {
    title: "Read an explainable result",
    body: "You get a clear risk score, a plain-English summary, the reasons behind it, and the smart follow-up questions to ask before you decide.",
  },
];

const SIGNALS = [
  {
    title: "Affordability",
    body: "The rent-to-income multiple — the single biggest predictor of whether the tenancy is sustainable.",
  },
  {
    title: "Stability",
    body: "Employment type, time in role, and how consistent the income picture looks over time.",
  },
  {
    title: "Completeness",
    body: "What's missing from the application, so you know exactly what to ask for before committing.",
  },
];

const DOES = [
  "Summarise an applicant's details into a clear, explainable risk view",
  "Highlight affordability and stability against the rent you set",
  "Suggest the follow-up questions and documents to request",
  "Save you time triaging multiple applicants for one property",
];

const DOES_NOT = [
  "Run a credit check or search credit-reference agency data",
  "Replace formal tenant referencing or Right to Rent checks",
  "Give legal advice or make the letting decision for you",
  "Make automated decisions — you stay in control of every choice",
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <MarketingHeader />

      <main className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16">
        <section className="space-y-5">
          <p className="section-label">Overview</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-text">
            From application to confident decision in seconds
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            LetLogic helps UK landlords make sense of a tenant application fast.
            Paste what you have and get an explainable risk score, a summary,
            and the questions worth asking — so you can decide with confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/screen" className="btn-primary px-5">
              Screen an applicant
            </Link>
            <Link href="/sample" className="btn-secondary px-5">
              View a sample report
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text">Three simple steps</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="card">
                <span className="text-sm font-semibold text-brand-600">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text">
            What we look at
          </h2>
          <p className="max-w-2xl text-text-muted">
            Every result is explainable. Instead of an opaque pass/fail, you see
            the signals behind the score so you can apply your own judgement.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {SIGNALS.map((signal) => (
              <div key={signal.title} className="card">
                <h3 className="font-semibold text-text">{signal.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{signal.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-success-border bg-success-bg p-6">
            <h2 className="text-lg font-semibold text-text">
              What LetLogic does
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              {DOES.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-success">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-text">
              What it isn&apos;t
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              {DOES_NOT.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-text-subtle">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text">
            Fair and Equality Act aware
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            LetLogic is designed to focus on affordability and stability — not
            protected characteristics. It is an aid to your judgement, never an
            automated decision. You remain the data controller and the
            decision-maker for every tenancy. Read more in our{" "}
            <Link href="/privacy" className="text-brand-700 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white">
          <h2 className="text-xl font-semibold">Try it on your next applicant</h2>
          <p className="mt-1 text-brand-100">
            Pay per screening, or go Pro for unlimited use.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/screen" className="btn-onbrand">
              Screen an applicant
            </Link>
            <Link
              href="/pricing"
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              See pricing
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
