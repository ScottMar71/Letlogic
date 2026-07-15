import Link from "next/link";
import {
  BadgeCheck,
  ClipboardPaste,
  Lock,
  Scale,
  ScanSearch,
  Shield,
  Users,
} from "lucide-react";
import {
  JsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { PRO_PLAN } from "@/lib/screening/pricing";
import { site } from "@/lib/site";

export const metadata = marketingPageMetadata({
  title: "Rent smarter. Trust faster.",
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

const CASE_STUDY = {
  context: "Independent landlord · 2-bed flat · Bristol",
  headline: "Fourteen applicants in 48 hours — without paying for fourteen references",
  problem:
    "A listing went live on Thursday; by Saturday there were fourteen enquiries. Full referencing runs £25–£40 per applicant — checking everyone would have cost hundreds before a single viewing.",
  approach:
    "The landlord pasted each application into LetLogic and had an explainable risk score, income multiple, and plain-English summary for every applicant within minutes — enough to spot weak affordability early.",
  outcome: [
    { label: "Applicants screened", value: "14" },
    { label: "Shortlisted for viewings", value: "3" },
    { label: "Full credit checks run", value: "3" },
  ],
  result:
    "LetLogic acted as a first filter: only the three shortlisted applicants went through full referencing, and a tenant was signed the following week.",
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={[organizationJsonLd(), webSiteJsonLd(), softwareApplicationJsonLd()]}
      />

      <main id="main-content" className="mx-auto max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16">
        <section className="space-y-6">
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Rent smarter. Trust faster.
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            LetLogic turns a tenant application into an explainable risk score,
            summary, and recommendation in seconds — so UK landlords can decide
            who&apos;s worth a full reference.
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

        <section className="space-y-6">
          <h2 className="text-h2 font-bold text-text">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="card">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50"
                  aria-hidden
                >
                  <step.icon className="h-5 w-5 text-brand-ink" />
                </div>
                <h3 className="mt-3 font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 font-bold text-text">Built for trust</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="card">
                <item.icon className="h-6 w-6 text-brand-ink" aria-hidden />
                <h3 className="mt-3 font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <p className="section-label">Case study</p>
            <h2 className="mt-2 max-w-2xl text-h2 font-bold text-text">
              {CASE_STUDY.headline}
            </h2>
            <p className="mt-2 text-sm text-text-subtle">{CASE_STUDY.context}</p>
          </div>

          <article className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="border-b border-border bg-surface-muted px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50"
                  aria-hidden
                >
                  <Users className="h-5 w-5 text-brand-ink" />
                </div>
                <p className="text-sm font-medium text-text">
                  The problem: too many applicants, too little time
                </p>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              <p className="max-w-3xl text-sm leading-relaxed text-text-muted">
                {CASE_STUDY.problem}
              </p>

              <div>
                <h3 className="text-sm font-semibold text-text">
                  The approach: screen first, reference later
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted">
                  {CASE_STUDY.approach}
                </p>
              </div>

              <dl className="grid gap-4 sm:grid-cols-3">
                {CASE_STUDY.outcome.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-surface-muted px-4 py-3"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-text">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="max-w-3xl text-sm leading-relaxed text-text-muted">
                {CASE_STUDY.result}
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white">
          <h2 className="text-xl font-semibold">
            Screen your next applicant in minutes
          </h2>
          <p className="mt-1 text-brand-100">
            From £4.99 per screening, or go Pro for {PRO_PLAN.monthlyCredits}{" "}
            screenings a month.
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
    </>
  );
}
