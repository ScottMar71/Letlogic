import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  GitCompare,
  MapPinOff,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardAction } from "@/lib/dashboard/insights";

function actionMessage(action: DashboardAction): string {
  switch (action.kind) {
    case "review_do_not_proceed":
      return `${action.count} applicant${action.count === 1 ? "" : "s"} flagged “Do not proceed” — review reports`;
    case "high_risk_this_week":
      return `${action.count} high-risk screening${action.count === 1 ? "" : "s"} in the last 7 days`;
    case "unlinked_screenings":
      return `${action.count} screening${action.count === 1 ? "" : "s"} not linked to a property`;
    case "property_without_screenings":
      return `${action.address} has no screenings yet`;
    case "compare_ready":
      return `${action.address} has ${action.count} applicants ready to compare`;
  }
}

function actionIcon(action: DashboardAction) {
  switch (action.kind) {
    case "review_do_not_proceed":
    case "high_risk_this_week":
      return AlertTriangle;
    case "unlinked_screenings":
      return MapPinOff;
    case "compare_ready":
      return GitCompare;
    case "property_without_screenings":
      return TrendingUp;
  }
}

export function DashboardPortfolioActions({
  actions,
}: {
  actions: DashboardAction[];
}) {
  if (actions.length === 0) return null;

  return (
    <Card padding="sm">
      <p className="text-sm font-semibold text-text">Needs attention</p>
      <p className="mt-0.5 text-xs text-text-muted">
        Suggested next steps based on your portfolio
      </p>
      <ul className="mt-3 space-y-2">
        {actions.map((action) => {
          const Icon = actionIcon(action);
          const isUrgent =
            action.kind === "review_do_not_proceed" ||
            action.kind === "high_risk_this_week";

          return (
            <li
              key={`${action.kind}-${"propertyId" in action ? action.propertyId : action.href}`}
            >
              <Link
                href={action.href}
                className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:border-brand-600 hover:bg-brand-50/30 ${
                  isUrgent
                    ? "border-warning-border bg-warning-bg/30"
                    : "border-border bg-surface"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isUrgent
                      ? "bg-warning-bg text-warning"
                      : "bg-surface-muted text-text-muted"
                  }`}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 text-text-muted group-hover:text-text">
                  {actionMessage(action)}
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-text-subtle opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
