import Link from "next/link";
import {
  CircleAlert,
  Eye,
  MapPin,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "About LetLogic — fairer tenant screening",
  description:
    "Why we built LetLogic: faster, fairer, explainable tenant screening for independent UK landlords who do their own lettings and want better decisions.",
  path: "/about",
});

const VALUES = [
  {
    icon: Eye,
    title: "Explainable, not opaque",
    body: "Every result shows its reasoning. We'd rather help you make a better decision than hand you a black-box verdict.",
  },
  {
    icon: Scale,
    title: "Fair by design",
    body: "We focus on affordability and stability, stay Equality Act aware, and never make automated decisions about people.",
  },
  {
    icon: CircleAlert,
    title: "Honest about limits",
    body: "We're a screening aid — not a credit check, referencing report, or legal advice. We say so clearly, everywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-respecting",
    body: "We collect the minimum we need, are transparent about our sub-processors, and put you in control of applicant data.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "About", path: "/about" }])} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16"
      >
        <section className="space-y-6">
          <p className="section-label">About us</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Better tenant decisions, without the guesswork
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            LetLogic was built for the landlords who do their own lettings —
            people juggling viewings, applications, and paperwork who need a
            faster, fairer way to size up an applicant before committing to a
            tenancy.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-muted">
            <span>UK only</span>
            <span aria-hidden>·</span>
            <span>Explainable screening</span>
            <span aria-hidden>·</span>
            <span>Not a credit check</span>
            <span aria-hidden>·</span>
            <span className="font-medium text-text">Equality Act aware</span>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card border-t-4 border-t-brand-600">
            <h2 className="text-h2 font-bold text-text">Why we built it</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
              <p>
                Screening a tenant usually means re-reading a long email, doing
                mental maths on affordability, and hoping you haven&apos;t missed
                something. Formal referencing is slow and expensive, and a credit
                score alone doesn&apos;t tell you whether a tenancy is
                sustainable.
              </p>
              <p>
                We wanted something in between: instant, explainable, and focused
                on the things that actually predict a good tenancy. So we built a
                tool that turns a messy application into a clear risk view in
                seconds — while keeping the landlord firmly in the driving seat.
              </p>
            </div>
          </article>

          <article className="card">
            <h2 className="text-h2 font-bold text-text">What we believe</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
              <p>
                Good screening should be quick, but it should also be fair and
                transparent. Decisions about where someone lives matter, so the
                reasoning behind a score should never be hidden. Our job is to
                help you ask better questions — not to replace your judgement.
              </p>
              <p>
                LetLogic is UK-focused and built with UK lettings in mind, from
                affordability multiples to Equality Act awareness.
              </p>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
              <MapPin
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                aria-hidden
              />
              <p className="text-sm text-text-muted">
                <span className="font-medium text-text">Built for UK landlords.</span>{" "}
                Affordability multiples, lettings norms, and compliance awareness
                designed around how independent landlords actually work.
              </p>
            </div>
          </article>
        </section>

        <section className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-h2 font-bold text-text">What we stand for</h2>
            <p className="text-sm text-text-muted">
              The principles behind every screening result — and how we think
              about responsible tenant assessment.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="card">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50"
                  aria-hidden
                >
                  <value.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="mt-3 font-semibold text-text">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white">
          <h2 className="text-xl font-semibold">
            Questions, feedback, or partnership ideas?
          </h2>
          <p className="mt-1 text-brand-100">
            We&apos;d genuinely like to hear from you.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-onbrand px-5">
              Get in touch
            </Link>
            <Link href="/how-it-works" className="btn-onbrand-secondary px-5">
              How it works
            </Link>
          </div>
        </section>
      </main>

    </>
  );
}
