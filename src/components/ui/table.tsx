import type { ReactNode } from "react";

export function Table({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border text-left text-text-subtle">
        {children}
      </tr>
    </thead>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function TableHeaderCell({
  children,
  sticky,
  className = "",
}: {
  children: ReactNode;
  sticky?: boolean;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 font-medium ${sticky ? "sticky left-0 z-10 bg-surface" : ""} ${className}`}
    >
      {children}
    </th>
  );
}

export function TableRowHeader({
  children,
  sticky,
}: {
  children: ReactNode;
  sticky?: boolean;
}) {
  return (
    <th
      scope="row"
      className={`px-4 py-3 text-left font-normal text-text-subtle ${sticky ? "sticky left-0 z-10 bg-surface" : ""}`}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-text ${className}`}>{children}</td>;
}
