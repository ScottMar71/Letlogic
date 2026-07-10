import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";

type LegalPageProps = {
  title: string;
  /** Canonical path for breadcrumb structured data, e.g. `/privacy`. */
  path: string;
  /** Defaults to the site-wide legal "Last updated" stamp. */
  updated?: string;
  /** Optional one-line summary shown under the title. */
  intro?: string;
  children: React.ReactNode;
};

export function LegalPage({
  title,
  path,
  updated = site.legalUpdated,
  intro,
  children,
}: LegalPageProps) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: title, path }])} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-narrow)] flex-1 px-4 py-12"
      >
        <header className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text">{title}</h1>
          {intro && <p className="mt-2 text-text-muted">{intro}</p>}
          <p className="mt-3 text-xs text-text-subtle">Last updated: {updated}</p>
        </header>

        <div className="legal mt-8">{children}</div>

        <p className="mt-12 rounded-lg border border-border bg-surface px-4 py-3 text-xs text-text-subtle">
          This page is provided for general information and is not legal advice.
          Please confirm with a qualified professional before relying on it.
        </p>
      </main>
    </>
  );
}
