import Link from "next/link";
import { LogoLink } from "@/components/brand/logo";
import { site } from "@/lib/site";

const PRODUCT_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/sample", label: "Sample report" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login?next=/screen", label: "Screen an applicant" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="section-label">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-[var(--container-content)] px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <LogoLink size="sm" />
            <p className="mt-3 max-w-xs text-sm text-text-muted">
              AI-powered tenant screening for UK landlords. A faster way to
              decide — not a credit check, referencing report, or legal advice.
            </p>
          </div>
          <FooterColumn title="Product" links={PRODUCT_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.company.legalName}. All rights
            reserved.
          </p>
          <p>UK only · {site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
