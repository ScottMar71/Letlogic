import Link from "next/link";
import { PricingPackCard } from "@/components/pricing/pricing-cta";
import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, breadcrumbJsonLd, pricingJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import {
  CREDIT_PACK_LIST,
  PRO_PLAN,
  formatGbp,
} from "@/lib/screening/pricing";
import { createClient } from "@/lib/supabase/server";

export const metadata = marketingPageMetadata({
  title: "Pricing — pay-as-you-go & Pro plans",
  description:
    `Transparent LetLogic pricing for UK tenant screening: pay per screening from £4.99 or go Pro for ${PRO_PLAN.monthlyCredits} screenings/month, applicant comparison, and PDF export.`,
  path: "/pricing",
});

const FAQS = [
  {
    question: "How much does a tenant screening cost?",
    answer:
      `Screenings start from £4.99 on pay-as-you-go credit packs, with the per-screening price dropping as you buy larger packs. Pro includes ${PRO_PLAN.monthlyCredits} screenings each month; buy extra credit packs when your allowance runs out.`,
  },
  {
    question: "Is there a free trial or free screening?",
    answer:
      "There are no free screenings, but you can view a full sample report before you buy so you know exactly what you'll get. You only pay when you screen a real applicant.",
  },
  {
    question: "What's included in the Pro plan?",
    answer:
      `Pro includes ${PRO_PLAN.monthlyCredits} screenings per month, the side-by-side applicant comparison view, and PDF export. When you've used your monthly allowance, buy additional credit packs at pay-as-you-go rates. Best for landlords screening applicants regularly.`,
  },
  {
    question: "Do credits expire?",
    answer:
      "Pay-as-you-go credits stay on your account so you can screen whenever an application comes in — there's no need to use them within a set period.",
  },
  {
    question: "Do you offer pricing for letting agents?",
    answer:
      "An Agency plan with team seats, API access, and white-label reports is coming soon. For now, letting agents can use Pro or pay-as-you-go credits — register interest at hello@letlogic.app.",
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <JsonLd
        data={[
          pricingJsonLd(),
          breadcrumbJsonLd([{ name: "Pricing", path: "/pricing" }]),
        ]}
      />

      <main id="main-content" className="mx-auto max-w-[var(--container-content)] flex-1 space-y-10 px-4 py-12">
        <FunnelTracker event="pricing_viewed" />
        <div className="text-center">
          <h1 className="text-h1 font-bold text-text">Simple, honest pricing</h1>
          <p className="mt-2 text-text-muted">
            Pay per screening, or go Pro for {PRO_PLAN.monthlyCredits} screenings
            a month. No free checks — but
            you can{" "}
            <Link href="/sample" className="text-brand-600 underline hover:text-brand-500">
              view a sample report
            </Link>{" "}
            first.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {CREDIT_PACK_LIST.map((pack) => (
            <PricingPackCard
              key={pack.slug}
              pack={pack}
              isAuthenticated={!!user}
            />
          ))}
        </section>

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">{PRO_PLAN.name}</p>
              <p className="text-brand-100">
                {PRO_PLAN.monthlyCredits} screenings/month · comparison view · PDF
                export · buy extra credit packs when your allowance runs out
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {formatGbp(PRO_PLAN.pricePence)}
                <span className="text-base font-normal text-brand-100">/mo</span>
              </p>
              <Link
                href={user ? "/settings" : "/login?next=/settings"}
                className="btn-onbrand mt-2"
              >
                Get started
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="inline-flex items-center gap-2 font-semibold text-text">
            Agency
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-muted">
              Coming soon
            </span>
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Team seats, API access, and white-label reports for letting agents.
            Use Pro or pay-as-you-go credits in the meantime.
          </p>
          <a
            href="mailto:hello@letlogic.app?subject=LetLogic%20Agency%20interest"
            className="mt-3 inline-block text-sm font-medium text-brand-600 underline hover:text-brand-500"
          >
            Register interest
          </a>
        </section>

        <FaqSection
          items={FAQS}
          intro="Everything you need to know about LetLogic pricing and plans."
        />

        <p className="text-center text-xs text-text-subtle">
          AI-generated screening aid. Not a credit check, referencing report, or
          legal advice.
        </p>
      </main>
    </>
  );
}
