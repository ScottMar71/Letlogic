import Link from "next/link";
import { GitCompareArrows, Home, ListChecks } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";

export const metadata = marketingPageMetadata({
  title: "Tenant screening for HMO landlords",
  description:
    "Screen and compare multiple applicants for the same room or HMO with LetLogic — explainable affordability and stability reads to fill rooms with confidence.",
  path: "/for-hmo-landlords",
});

const BENEFITS = [
  {
    icon: GitCompareArrows,
    title: "Compare applicants",
    body: "When several people apply for the same room, compare their affordability and stability side by side instead of juggling separate emails.",
  },
  {
    icon: Home,
    title: "Fill rooms with confidence",
    body: "Quickly assess a steady stream of applicants so rooms don't sit empty while you work through paperwork.",
  },
  {
    icon: ListChecks,
    title: "Spot the gaps",
    body: "See what's missing from each application and which follow-up questions to ask before offering a room.",
  },
];

const FAQS = [
  {
    question: "Can I compare multiple applicants for one room?",
    answer:
      "Yes. Screen each applicant and compare their explainable risk reads. The Pro plan adds a side-by-side comparison view that's well suited to HMO lettings.",
  },
  {
    question: "Does LetLogic handle high applicant volume?",
    answer:
      "Each screening takes seconds, so it scales comfortably with the higher applicant flow typical of HMO rooms. Pay-as-you-go and Pro both work depending on volume.",
  },
  {
    question: "Is it a replacement for referencing HMO tenants?",
    answer:
      "No. It's a fast first pass to triage applicants. Formal referencing and Right to Rent checks still apply before granting a tenancy.",
  },
];

export default function ForHmoLandlordsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "For HMO landlords", path: "/for-hmo-landlords" },
        ])}
      />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-16 px-4 py-16"
      >
        <section className="space-y-5">
          <p className="section-label">For HMO landlords</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Screen and compare applicants for every room
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            HMOs mean more applicants and faster turnover. LetLogic gives you an
            explainable read on each one — and a comparison view to choose
            between people applying for the same room.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sample" className="btn-primary px-5">
              View a sample report
            </Link>
            <Link href="/pricing" className="btn-secondary px-5">
              See Pro &amp; comparison
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-h2 font-bold text-text">Built for room-by-room lettings</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="card">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50"
                  aria-hidden
                >
                  <benefit.icon className="h-5 w-5 text-brand-ink" />
                </div>
                <h3 className="mt-3 font-semibold text-text">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <FaqSection items={FAQS} />

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white">
          <h2 className="text-xl font-semibold">Fill your next room faster</h2>
          <p className="mt-1 text-brand-100">
            Compare applicants with an explainable risk read.
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
