import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { GUIDES, guidePath } from "@/lib/guides";

export const metadata = marketingPageMetadata({
  title: "Tenant screening guides for landlords",
  description:
    "Practical guides for UK landlords on tenant screening and vetting — affordability, Right to Rent, legal compliance, and reading applications, with clear, jargon-free explanations you can act on.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Guides", path: "/guides" }])} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-content)] flex-1 space-y-10 px-4 py-16"
      >
        <section className="space-y-3">
          <p className="section-label">Resources</p>
          <h1 className="max-w-3xl text-display font-bold tracking-tight text-text">
            Guides for UK landlords
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Clear, practical guidance on assessing tenants — from vetting and
            affordability to Right to Rent and reading an application well. No
            jargon, no fluff.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={guidePath(guide.slug)}
              className="card flex flex-col justify-between hover:border-brand-300"
            >
              <div>
                <h2 className="font-semibold text-text">{guide.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {guide.summary}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                Read guide
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">
            Looking for the bigger picture? Start with our{" "}
            <Link
              href="/tenant-screening"
              className="text-brand-600 underline hover:text-brand-500"
            >
              tenant screening guide
            </Link>
            .
          </p>
        </section>
      </main>

    </>
  );
}
