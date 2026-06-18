import Link from "next/link";
import { BadgeCheck, Clock, Scale } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "Tenant screening for landlords",
  description:
    "LetLogic helps independent UK landlords screen tenant applications in seconds — an explainable risk score and the right questions to ask, without referencing overhead.",
  path: "/for-landlords",
});

const BENEFITS = [
  {
    icon: Clock,
    title: "Decide faster",
    body: "Turn a long application email into a clear risk read in seconds, so you can respond to good applicants before someone else does.",
  },
  {
    icon: Scale,
    title: "Stay fair",
    body: "Focus on affordability and stability, not protected characteristics. Every result is explainable and you make the final call.",
  },
  {
    icon: BadgeCheck,
    title: "Know what to ask",
    body: "Get suggested follow-up questions and the documents to request, so you can fill the gaps before committing to a tenancy.",
  },
];

const FAQS = [
  {
    question: "Is LetLogic suitable for a single property?",
    answer:
      "Yes. Pay-as-you-go credits from £4.99 mean there's no subscription required — it's ideal for landlords letting one or a few properties.",
  },
  {
    question: "Do I need any setup or integration?",
    answer:
      "No. Paste the applicant's details — an email, a form, or your own notes — and LetLogic returns an explainable assessment. There's nothing to install.",
  },
  {
    question: "Will it make the decision for me?",
    answer:
      "No. LetLogic is a decision aid. You remain the data controller and the decision-maker for every tenancy.",
  },
];

export default function ForLandlordsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "For landlords", path: "/for-landlords" },
        ])}
      />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16"
      >
        <section className="space-y-5">
          <p className="section-label">For landlords</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Screen tenants confidently, without the overhead
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Built for independent UK landlords who do their own lettings.
            LetLogic turns a messy application into an explainable risk score,
            summary, and the questions worth asking — in seconds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sample" className="btn-primary px-5">
              View a sample report
            </Link>
            <Link href="/tenant-screening" className="btn-secondary px-5">
              Read the screening guide
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
          <h2 className="text-xl font-semibold">Screen your next applicant</h2>
          <p className="mt-1 text-brand-100">Pay per screening from £4.99.</p>
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
