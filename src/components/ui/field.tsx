import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
};

export function Field({ label, hint, htmlFor, children }: FieldProps) {
  const hintId = hint ? `${htmlFor ?? label}-hint` : undefined;
  return (
    <label className="block space-y-1" htmlFor={htmlFor}>
      <span className="field-label">{label}</span>
      {hint && (
        <p id={hintId} className="text-xs text-text-subtle">
          {hint}
        </p>
      )}
      {children}
    </label>
  );
}
