"use client";

import type { LucideIcon } from "lucide-react";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  description?: string;
  badge?: string;
};

type SegmentedControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  const columns =
    options.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <div
      className={`grid gap-2 ${columns}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        const Icon = opt.icon;

        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={`group relative flex min-h-11 items-start gap-3 rounded-xl border p-3 text-left transition-all ${
              selected
                ? "border-brand-ink bg-brand-50/50 shadow-sm ring-1 ring-brand-ink/15"
                : "border-border-strong bg-surface hover:border-brand-600 hover:bg-brand-50/30"
            }`}
          >
            {opt.badge ? (
              <span className="absolute -top-2 right-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-on-teal">
                {opt.badge}
              </span>
            ) : null}
            {Icon && (
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  selected
                    ? "bg-brand-600 text-text-on-teal"
                    : "bg-surface-muted text-text-muted group-hover:bg-brand-50 group-hover:text-brand-ink"
                }`}
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>
            )}
            <span className="min-w-0 pt-0.5">
              <span
                className={`block text-sm font-medium ${
                  selected ? "font-semibold text-text" : "text-text"
                }`}
              >
                {opt.label}
              </span>
              {opt.description && (
                <span className="mt-0.5 block text-xs text-text-muted">
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
