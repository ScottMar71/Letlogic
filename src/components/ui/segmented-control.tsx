"use client";

type Option<T extends string> = {
  value: T;
  label: string;
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
    <div className="flex gap-2" role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`min-h-11 rounded-lg px-3 text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-brand-600 text-text-on-teal"
              : "border border-border-strong text-text-muted hover:border-brand-600"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
