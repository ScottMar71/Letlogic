const styles: Record<string, string> = {
  low: "bg-success-bg text-success",
  medium: "bg-warning-bg text-warning",
  high: "bg-danger-bg text-danger",
};

const dotStyles: Record<string, string> = {
  low: "bg-success",
  medium: "bg-warning",
  high: "bg-danger",
};

const labels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function RiskChip({ level, score }: { level: string; score: number }) {
  return (
    <span
      className={`badge whitespace-nowrap ${styles[level] ?? "bg-zinc-100 text-text-muted"}`}
      aria-label={`Risk score ${score} out of 100, ${level} risk`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${dotStyles[level] ?? "bg-zinc-400"}`}
      />
      {labels[level] ?? level} · {score}
    </span>
  );
}
