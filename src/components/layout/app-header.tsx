import Link from "next/link";
import { LogoLink } from "@/components/brand/logo";
import { CreditBalance } from "@/components/screening/credit-balance";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { AppNavLink } from "@/components/layout/app-nav-link";

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
    <header className="no-print border-b border-border bg-surface">
      <div
        className={`mx-auto flex ${widthClass[width]} flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-5`}
      >
        <LogoLink href="/dashboard" size="nav" />
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {creditBalance != null && <CreditBalance balance={creditBalance} />}
          <AppNavLink href="/dashboard">Dashboard</AppNavLink>
          <AppNavLink href="/screen">Screen</AppNavLink>
          <AppNavLink href="/properties">Properties</AppNavLink>
          <AppNavLink href="/settings">Settings</AppNavLink>
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}
