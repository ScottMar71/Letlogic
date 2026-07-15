"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navClass = (active: boolean) =>
  `inline-flex min-h-11 items-center text-sm transition-colors ${
    active
      ? "font-medium text-brand-ink"
      : "text-text-muted hover:text-brand-ink"
  }`;

export function AppNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className={navClass(active)} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
