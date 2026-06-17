import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  title?: string;
  padding?: "sm" | "md" | "lg";
  className?: string;
};

const paddingClass = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export function Card({
  children,
  title,
  padding = "md",
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface ${paddingClass[padding]} ${className}`}
    >
      {title && (
        <p className="mb-2 text-sm font-semibold text-text">{title}</p>
      )}
      {children}
    </div>
  );
}
