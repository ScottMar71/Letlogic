import { Check, Minus, X } from "lucide-react";

type ComparisonValue = boolean | "partial" | string;

type ComparisonRow = {
  /** Feature / attribute being compared. */
  label: string;
  /** One value per column, in the same order as `columns`. */
  values: ComparisonValue[];
};

type ComparisonTableProps = {
  /** Column headings (first conceptual column is the row label). */
  columns: string[];
  rows: ComparisonRow[];
  /** Accessible caption describing the comparison. */
  caption: string;
};

function Cell({ value }: { value: ComparisonValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1 text-success">
        <Check className="h-4 w-4" aria-hidden />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1 text-text-subtle">
        <X className="h-4 w-4" aria-hidden />
        <span className="sr-only">No</span>
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center gap-1 text-text-muted">
        <Minus className="h-4 w-4" aria-hidden />
        <span className="sr-only">Partial</span>
      </span>
    );
  }
  return <span className="text-sm text-text-muted">{value}</span>;
}

export function ComparisonTable({ columns, rows, caption }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-text">
              Feature
            </th>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-3 text-sm font-semibold text-text"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th
                scope="row"
                className="px-4 py-3 text-sm font-medium text-text"
              >
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td key={`${row.label}-${index}`} className="px-4 py-3">
                  <Cell value={value} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
