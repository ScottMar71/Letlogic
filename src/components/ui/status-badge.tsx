const variants = {
  default: "bg-brand-50 text-text-muted",
  pro: "bg-brand-600 text-text-on-teal",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  neutral: "bg-surface-muted text-text-muted",
} as const;

export function StatusBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span className={`badge ${variants[variant]}`}>{children}</span>
  );
}

export const PURCHASE_STATUS_LABELS: Record<string, { label: string; variant: keyof typeof variants }> = {
  succeeded: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
  canceled: { label: "Cancelled", variant: "neutral" },
};
