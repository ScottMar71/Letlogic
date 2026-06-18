import type { Recommendation } from "@/lib/screening/types";
import { RECOMMENDATION_LABELS } from "@/lib/screening/types";

const styles: Record<Recommendation, string> = {
  proceed: "bg-success-bg text-success",
  proceed_with_conditions: "bg-warning-bg text-warning",
  do_not_proceed: "bg-danger-bg text-danger",
};

const dotStyles: Record<Recommendation, string> = {
  proceed: "bg-success",
  proceed_with_conditions: "bg-warning",
  do_not_proceed: "bg-danger",
};

export function RecommendationChip({
  recommendation,
  compact = false,
}: {
  recommendation: string;
  compact?: boolean;
}) {
  const key = recommendation as Recommendation;
  const label = RECOMMENDATION_LABELS[key] ?? recommendation;

  return (
    <span
      className={`badge whitespace-nowrap ${styles[key] ?? "bg-surface-muted text-text-muted"}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${dotStyles[key] ?? "bg-text-subtle"}`}
      />
      {compact ? label.split(" ")[0] : label}
    </span>
  );
}
