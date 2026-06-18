import Link from "next/link";
import {
  BadgeCheck,
  ClipboardPaste,
  Lock,
  Scale,
  ScanSearch,
  Shield,
} from "lucide-react";
import {
  JsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata = marketingPageMetadata({
  title: "AI tenant screening for UK landlords",
  description: site.description,
  path: "/",
});

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste the application",
    body: "Drop in the tenant's details — an email, a form, or notes. No setup.",
  },
  {
    icon: ScanSearch,
    title: "Analyse in seconds",
    body: "We compute the income multiple and stability, then explain the risk.",
  },
  {
    icon: BadgeCheck,
    title: "Decide with confidence",
    body: "Get a score, recommendation, and the questions to ask next.",
  },
];

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "UK-focused & GDPR-aware",
    body: "Built for UK lettings with transparent data handling and minimal collection.",
  },
  {
    icon: Scale,
    title: "Equality Act aware",
    body: "Focuses on affordability and stability — never automated decisions about people.",
  },
  {
    icon: Lock,
    title: "Not a credit check",
    body: "An explainable screening aid. You stay in control of every letting decision.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={[organizationJsonLd(), webSiteJsonLd(), softwareApplicationJsonLd()]}
      />

      <main id="main-content" className="mx-auto max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16">
        <section className="space-y-6">
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Screen UK tenant applications in seconds
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Paste an applicant&apos;s details and get an explainable risk score,
            summary, and recommendation — not a credit check, just a faster way
            to decide.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sample" className="btn-primary px-5">
              View a sample report
            </Link>
            <Link href="/login?next=/screen" className="btn-secondary px-5">
              Sign in to screen
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
          {STEPS.map((step) => (
            <div key={step.title} className="card">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50"
                aria-hidden
              >
                <step.icon className="h-5 w-5 text-brand-600" />
              </div>
              <h2 className="mt-3 font-semibold text-text">{step.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 font-bold text-text">Built for trust</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="card">
                <item.icon className="h-6 w-6 text-brand-600" aria-hidden />
                <h3 className="mt-3 font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-text-subtle">
            Trusted by independent UK landlords
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-muted">
            We&apos;re onboarding our first design partners now. Early users get
            comp credits and a direct line to the team while we refine the
            product.
          </p>
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
            className="mt-4 inline-block text-sm font-medium text-brand-600 underline hover:text-brand-500"
          >
            See pricing
          </Link>
        </section>
      </main>
    </>
  );
}
