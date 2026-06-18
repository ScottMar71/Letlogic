"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/sample", label: "Sample report" },
];

type MobileNavProps = {
  showPricing?: boolean;
};

export function MobileNav({ showPricing = true }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const links = showPricing
    ? LINKS
    : LINKS.filter((l) => l.href !== "/pricing");

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted sm:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <MobileNavDrawer
        open={open}
        onClose={close}
        ariaLabel="Navigation menu"
        visibleBelow="sm"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-3 text-sm font-medium text-text hover:bg-surface-muted"
            onClick={close}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/login" className="btn-primary mt-4" onClick={close}>
          Sign in
        </Link>
      </MobileNavDrawer>
    </>
  );
}
