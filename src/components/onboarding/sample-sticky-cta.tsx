"use client";

import Link from "next/link";

export function SampleStickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 p-4 shadow-lg backdrop-blur-sm sm:hidden"
      role="region"
      aria-label="Create account to screen"
    >
      <p className="mb-2 text-center text-xs text-text-muted">
        Ready to screen a real applicant?
      </p>
      <div className="flex gap-2">
        <Link
          href="/pricing"
          className="btn-secondary min-w-0 shrink-0 px-4 text-center"
        >
          Pricing
        </Link>
        <Link
          href="/signup?next=/screen"
          className="btn-primary min-w-0 flex-1 text-center"
        >
          Create account to screen
        </Link>
      </div>
    </div>
  );
}
