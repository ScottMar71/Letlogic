import Link from "next/link";
import { Building2, Coins, FileText, ScanSearch } from "lucide-react";

type QuickActionsProps = {
  balance: number;
  hasScreenings: boolean;
};

const actions = [
  {
    key: "screen",
    label: "Screen applicant",
    href: "/screen",
    icon: ScanSearch,
    show: () => true,
  },
  {
    key: "property",
    label: "Add property",
    href: "/properties/new",
    icon: Building2,
    show: () => true,
  },
  {
    key: "sample",
    label: "View sample report",
    href: "/sample",
    icon: FileText,
    show: (p: QuickActionsProps) => !p.hasScreenings,
  },
  {
    key: "credits",
    label: "Buy credits",
    href: "/settings",
    icon: Coins,
    show: (p: QuickActionsProps) => p.balance <= 2,
  },
] as const;

export function QuickActions(props: QuickActionsProps) {
  const visible = actions.filter((a) => a.show(props));
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.key}
            href={action.href}
            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:border-brand-600 hover:text-brand-ink"
          >
            <Icon className="h-4 w-4" aria-hidden />
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}
