import Link from "next/link";

type MarketingHeaderProps = {
  width?: "narrow" | "content" | "wide";
  showPricing?: boolean;
};

const widthClass = {
  narrow: "max-w-[var(--container-narrow)]",
  content: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
} as const;

export function MarketingHeader({
  width = "content",
  showPricing = true,
}: MarketingHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div
        className={`mx-auto flex ${widthClass[width]} items-center justify-between px-4 py-3`}
      >
        <Link href="/" className="font-semibold text-text">
          LetLogic
        </Link>
        <nav className="flex items-center gap-x-2 sm:gap-x-4">
          <Link href="/how-it-works" className="nav-link hidden sm:inline-flex">
            How it works
          </Link>
          <Link href="/about" className="nav-link hidden sm:inline-flex">
            About
          </Link>
          {showPricing && (
            <Link href="/pricing" className="nav-link">
              Pricing
            </Link>
          )}
          <Link href="/login" className="btn-primary px-4">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
