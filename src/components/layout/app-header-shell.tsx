import { LogoLink } from "@/components/brand/logo";
import { CreditBalance } from "@/components/screening/credit-balance";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { AppNavLink } from "@/components/layout/app-nav-link";
import { AppMobileNav } from "@/components/layout/app-mobile-nav";
import type { AppLayoutWidth } from "@/components/layout/authenticated-page";

type AppHeaderShellProps = {
  creditBalance?: number;
  isAdmin?: boolean;
  width?: AppLayoutWidth;
};

const widthClass = {
  narrow: "max-w-[var(--container-narrow)]",
  content: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
} as const;

export function AppHeaderShell({
  creditBalance,
  isAdmin = false,
  width = "content",
}: AppHeaderShellProps) {
  return (
    <header className="no-print border-b border-border bg-surface">
      <div
        className={`mx-auto flex ${widthClass[width]} items-center justify-between gap-x-4 px-4 py-4 lg:py-5`}
      >
        <LogoLink href="/dashboard" size="nav" />
        <div className="flex items-center gap-x-3">
          {creditBalance != null && (
            <>
              <span className="hidden text-sm sm:inline lg:hidden">
                <span className="font-semibold text-text">{creditBalance}</span>
                <span className="text-text-muted">
                  {" "}
                  credit{creditBalance === 1 ? "" : "s"}
                </span>
              </span>
              <div className="hidden lg:block">
                <CreditBalance balance={creditBalance} />
              </div>
            </>
          )}
          <nav className="hidden items-center gap-x-4 lg:flex">
            <AppNavLink href="/dashboard">Dashboard</AppNavLink>
            <AppNavLink href="/screen">Screen</AppNavLink>
            <AppNavLink href="/properties">Properties</AppNavLink>
            <AppNavLink href="/settings">Settings</AppNavLink>
            {isAdmin ? <AppNavLink href="/admin">Admin</AppNavLink> : null}
            <SignOutButton />
          </nav>
          <AppMobileNav creditBalance={creditBalance} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
