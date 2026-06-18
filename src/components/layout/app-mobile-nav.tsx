"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/screen", label: "Screen" },
  { href: "/properties", label: "Properties" },
  { href: "/settings", label: "Settings" },
] as const;

type AppMobileNavProps = {
  creditBalance?: number;
};

function linkClass(active: boolean) {
  return `rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
    active
      ? "bg-brand-50 text-brand-700"
      : "text-text hover:bg-surface-muted"
  }`;
}

function isActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppMobileNav({ creditBalance }: AppMobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted lg:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <MobileNavDrawer
        open={open}
        onClose={close}
        ariaLabel="App navigation"
        visibleBelow="lg"
        logoHref="/dashboard"
        headerExtra={
          creditBalance != null ? (
            <div className="border-b border-border px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                Credit balance
              </p>
              <p className="mt-1 text-lg font-bold text-text">
                {creditBalance}{" "}
                <span className="text-sm font-medium text-text-muted">
                  credit{creditBalance === 1 ? "" : "s"}
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setBuyOpen(true);
                  close();
                }}
                className="btn-primary mt-3 w-full min-h-9 text-sm"
              >
                Buy credits
              </button>
            </div>
          ) : undefined
        }
        footer={
          <SignOutButton className="nav-link w-full justify-center rounded-lg hover:bg-surface-muted" />
        }
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={linkClass(isActive(pathname, link.href))}
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
            onClick={close}
          >
            {link.label}
          </Link>
        ))}
      </MobileNavDrawer>

      <BuyCreditsModal open={buyOpen} onClose={() => setBuyOpen(false)} />
    </>
  );
}
