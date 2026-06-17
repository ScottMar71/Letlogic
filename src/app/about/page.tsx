import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata = {
  title: "About us",
  description:
    "Why we built LetLogic — faster, fairer, explainable tenant screening for independent UK landlords.",
};

const VALUES = [
  {
    title: "Explainable, not opaque",
    body: "Every result shows its reasoning. We'd rather help you make a better decision than hand you a black-box verdict.",
  },
  {
    title: "Fair by design",
    body: "We focus on affordability and stability, stay Equality Act aware, and never make automated decisions about people.",
  },
  {
    title: "Honest about limits",
    body: "We're a screening aid — not a credit check, referencing report, or legal advice. We say so clearly, everywhere.",
  },
  {
    title: "Privacy-respecting",
    body: "We collect the minimum we need, are transparent about our sub-processors, and put you in control of applicant data.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <MarketingHeader />

      <main className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16">
        <section className="space-y-5">
          <p className="section-label">About us</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-text">
            Better tenant decisions, without the guesswork
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            LetLogic was built for the landlords who do their own lettings —
            people juggling viewings, applications, and paperwork who need a
            faster, fairer way to size up an applicant before committing to a
            tenancy.
          </p>
        </section>

        <section className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text">Why we built it</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Screening a tenant usually means re-reading a long email, doing
              mental maths on affordability, and hoping you haven&apos;t missed
              something. Formal referencing is slow and expensive, and a credit
              score alone doesn&apos;t tell you whether a tenancy is
              sustainable.
            </p>
            <p className="text-sm leading-relaxed text-text-muted">
              We wanted something in between: instant, explainable, and focused
              on the things that actually predict a good tenancy. So we built a
              tool that turns a messy application into a clear risk view in
              seconds — while keeping the landlord firmly in the driving seat.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text">What we believe</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Good screening should be quick, but it should also be fair and
              transparent. Decisions about where someone lives matter, so the
              reasoning behind a score should never be hidden. Our job is to
              help you ask better questions — not to replace your judgement.
            </p>
            <p className="text-sm leading-relaxed text-text-muted">
              LetLogic is UK-focused and built with UK lettings in mind, from
              affordability multiples to Equality Act awareness.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text">What we stand for</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="card">
                <h3 className="font-semibold text-text">{value.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{value.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-text">
            Questions, feedback, or partnership ideas?
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            We&apos;d genuinely like to hear from you.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary px-5">
              Get in touch
            </Link>
            <Link href="/how-it-works" className="btn-secondary px-5">
              How it works
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
