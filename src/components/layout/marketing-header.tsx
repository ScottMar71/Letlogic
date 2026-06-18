import Link from "next/link";
import { LogoLink } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";

export type MarketingHeaderProps = {
  width?: "narrow" | "content" | "wide";
  showPricing?: boolean;
  isAuthenticated?: boolean;
};

const widthClass = {
  narrow: "max-w-[var(--container-narrow)]",
  content: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
} as const;

export function MarketingHeader({
  width = "content",
  showPricing = true,
  isAuthenticated = false,
}: MarketingHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div
        className={`mx-auto flex ${widthClass[width]} items-center justify-between px-4 py-5`}
      >
        <LogoLink size="nav" />
        <nav className="flex items-center gap-x-2 sm:gap-x-4">
          <Link href="/how-it-works" className="nav-link hidden sm:inline-flex">
            How it works
          </Link>
          <Link href="/about" className="nav-link hidden sm:inline-flex">
            About
          </Link>
          {showPricing && (
            <Link href="/pricing" className="nav-link hidden sm:inline-flex">
              Pricing
            </Link>
          )}
          <Link href="/sample" className="nav-link hidden sm:inline-flex">
            Sample
          </Link>
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="btn-primary hidden px-4 sm:inline-flex"
            >
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-primary hidden px-4 sm:inline-flex">
              Sign in
            </Link>
          )}
          <MobileNav showPricing={showPricing} isAuthenticated={isAuthenticated} />
        </nav>
      </div>
    </header>
  );
}
