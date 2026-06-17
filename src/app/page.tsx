import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const STEPS = [
  {
    title: "Paste the application",
    body: "Drop in the tenant's details — an email, a form, or notes. No setup.",
  },
  {
    title: "Analyse in seconds",
    body: "We compute the income multiple and stability, then explain the risk.",
  },
  {
    title: "Decide with confidence",
    body: "Get a score, recommendation, and the questions to ask next.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <MarketingHeader />

      <main className="mx-auto max-w-[var(--container-content)] space-y-16 px-4 py-16">
        <section className="space-y-6">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-text">
            Screen UK tenant applications in seconds
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Paste an applicant&apos;s details and get an explainable risk score,
            summary, and recommendation — not a credit check, just a faster way
            to decide.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/screen" className="btn-primary px-5">
              Screen an applicant
            </Link>
            <Link href="/sample" className="btn-secondary px-5">
              View a sample report
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-muted">
            <span>UK only</span>
            <span aria-hidden>·</span>
            <span>Not a credit check</span>
            <span aria-hidden>·</span>
            <span>Not legal advice</span>
            <span aria-hidden>·</span>
            <span className="font-medium text-text">Equality Act aware</span>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card">
              <span className="text-sm font-semibold text-brand-600">
                {i + 1}
              </span>
              <h2 className="mt-1 font-semibold text-text">{step.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-text">
            Pay per screening, or go Pro
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            From £4.99 per screening. Unlimited screenings and applicant
            comparison on Pro.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-block text-sm font-medium text-brand-700 underline"
          >
            See pricing
          </Link>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
