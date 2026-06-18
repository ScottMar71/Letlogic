import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Coins,
  ScanSearch,
} from "lucide-react";
import { Card } from "@/components/ui/card";

type DashboardStatsProps = {
  balance: number;
  propertyCount: number;
  screeningCount: number;
  screeningsThisMonth: number;
};

const statConfig = [
  {
    key: "credits",
    label: "Credits",
    icon: Coins,
    accent: "bg-brand-50 text-brand-600",
    getValue: (p: DashboardStatsProps) => String(p.balance),
    getHint: (p: DashboardStatsProps) =>
      p.balance === 0
        ? "Top up to screen applicants"
        : p.balance <= 2
          ? "Running low — consider topping up"
          : "Available for screenings",
    getHref: () => "/settings",
  },
  {
    key: "properties",
    label: "Properties",
    icon: Building2,
    accent: "bg-info-bg text-info",
    getValue: (p: DashboardStatsProps) => String(p.propertyCount),
    getHint: (p: DashboardStatsProps) =>
      p.propertyCount === 0
        ? "Add a property to organise screenings"
        : "Tracked in your portfolio",
    getHref: () => "/properties",
  },
  {
    key: "total",
    label: "Total screenings",
    icon: ScanSearch,
    accent: "bg-surface-muted text-text-muted",
    getValue: (p: DashboardStatsProps) => String(p.screeningCount),
    getHint: (p: DashboardStatsProps) =>
      p.screeningCount === 0
        ? "Run your first screening"
        : "All-time assessments",
    getHref: () => "/screen",
  },
  {
    key: "month",
    label: "This month",
    icon: CalendarDays,
    accent: "bg-success-bg text-success",
    getValue: (p: DashboardStatsProps) => String(p.screeningsThisMonth),
    getHint: (p: DashboardStatsProps) =>
      p.screeningsThisMonth === 0
        ? "No screenings yet this month"
        : "Screenings this calendar month",
    getHref: () => "/screen",
  },
] as const;

export function DashboardStats(props: DashboardStatsProps) {
  const { balance } = props;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;
        const isLowCredits = stat.key === "credits" && balance <= 2;
        const value = stat.getValue(props);
        const hint = stat.getHint(props);

        return (
          <Link key={stat.key} href={stat.getHref()} className="group block">
            <Card
              padding="sm"
              className={`h-full transition-colors hover:border-brand-600 ${
                isLowCredits
                  ? "border-warning-border bg-warning-bg/40"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.accent}`}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </div>
                {isLowCredits && (
                  <span className="badge bg-warning-bg text-warning">Low</span>
                )}
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-text-subtle">
                {stat.label}
              </p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-text">
                {value}
              </p>
              <p className="mt-1 text-xs text-text-muted group-hover:text-brand-600">
                {hint}
              </p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
