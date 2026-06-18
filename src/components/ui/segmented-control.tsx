"use client";

import type { LucideIcon } from "lucide-react";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  description?: string;
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
  return (
    <div
      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
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
            className={`group flex min-h-11 items-start gap-3 rounded-xl border p-3 text-left transition-all ${
              selected
                ? "border-brand-600 bg-brand-50/50 shadow-sm ring-1 ring-brand-600/15"
                : "border-border-strong bg-surface hover:border-brand-600 hover:bg-brand-50/30"
            }`}
          >
            {Icon && (
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  selected
                    ? "bg-brand-600 text-text-on-teal"
                    : "bg-surface-muted text-text-muted group-hover:bg-brand-50 group-hover:text-brand-600"
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
