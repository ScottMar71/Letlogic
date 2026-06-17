import Link from "next/link";
import { LogoLink } from "@/components/brand/logo";
import { CreditBalance } from "@/components/screening/credit-balance";
import { SignOutButton } from "@/components/layout/sign-out-button";

type AppHeaderProps = {
  creditBalance?: number;
  width?: "narrow" | "content" | "wide";
};

const widthClass = {
  narrow: "max-w-[var(--container-narrow)]",
  content: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
} as const;

export function AppHeader({
  creditBalance,
  width = "content",
}: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div
        className={`mx-auto flex ${widthClass[width]} flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3`}
      >
        <LogoLink href="/dashboard" size="md" />
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {creditBalance != null && <CreditBalance balance={creditBalance} />}
          <Link href="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link href="/settings" className="nav-link">
            Settings
          </Link>
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}
