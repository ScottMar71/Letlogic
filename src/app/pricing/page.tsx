import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import {
  CREDIT_PACK_LIST,
  PRO_PLAN,
  formatGbp,
  unitPricePence,
} from "@/lib/screening/pricing";

export const metadata = {
  title: "Pricing",
  description: "Transparent pay-as-you-go and Pro pricing for UK tenant screening.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <MarketingHeader showPricing={false} />

      <main className="mx-auto max-w-[var(--container-content)] space-y-10 px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text">Simple, honest pricing</h1>
          <p className="mt-2 text-text-muted">
            Pay per screening, or go Pro for unlimited use. No free checks — but
            you can{" "}
            <Link href="/sample" className="text-brand-600 underline hover:text-brand-500">
              view a sample report
            </Link>{" "}
            first.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {CREDIT_PACK_LIST.map((pack) => (
            <div
              key={pack.slug}
              className="rounded-2xl border border-border bg-surface p-6 text-center"
            >
              <p className="font-semibold text-text">{pack.name}</p>
              <p className="mt-2 text-3xl font-bold text-text">
                {formatGbp(pack.pricePence)}
              </p>
              <p className="mt-1 text-sm text-text-subtle">
                {formatGbp(unitPricePence(pack))} per screening
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-brand-700 bg-brand-700 p-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">{PRO_PLAN.name}</p>
              <p className="text-brand-100">
                {PRO_PLAN.monthlyCredits} screenings/month · comparison view · PDF
                export · {formatGbp(PRO_PLAN.overagePencePerCredit)}/screening
                after that
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {formatGbp(PRO_PLAN.pricePence)}
                <span className="text-base font-normal text-brand-100">/mo</span>
              </p>
              <Link href="/dashboard" className="btn-onbrand mt-2">
                Get started
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="font-semibold text-text">Agency</p>
          <p className="mt-1 text-sm text-text-muted">
            Team seats, API access, and white-label reports for letting agents.
          </p>
          <a
            href="mailto:hello@letlogic.app?subject=LetLogic%20Agency"
            className="mt-3 inline-block text-sm font-medium text-brand-600 underline hover:text-brand-500"
          >
            Talk to us
          </a>
        </section>

        <p className="text-center text-xs text-text-subtle">
          AI-generated screening aid. Not a credit check, referencing report, or
          legal advice.
        </p>
      </main>
    </div>
  );
}
