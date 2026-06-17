import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border-strong bg-surface p-8 text-center">
      {icon && (
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-text-subtle">
          {icon}
        </div>
      )}
      <p className="font-medium text-text">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-text-subtle">{description}</p>
      )}
      {(actionLabel || secondaryLabel) && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {actionLabel && actionHref && (
            <Link href={actionHref} className="btn-primary">
              {actionLabel}
            </Link>
          )}
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref} className="btn-secondary">
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
