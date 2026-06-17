import type { ReactNode } from "react";

const variants = {
  success: "border-success-border bg-success-bg text-success",
  error: "border-danger-border bg-danger-bg text-danger",
  warning: "border-warning-border bg-warning-bg text-warning",
  info: "border-brand-200 bg-brand-50 text-text",
} as const;

type AlertProps = {
  variant?: keyof typeof variants;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Alert({
  variant = "info",
  title,
  children,
  className = "",
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border p-3 text-sm ${variants[variant]} ${className}`}
    >
      {title && <p className="font-medium">{title}</p>}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}
