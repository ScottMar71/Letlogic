"use client";

import Link from "next/link";

export function SampleStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 p-4 shadow-lg backdrop-blur-sm sm:hidden">
      <p className="mb-2 text-center text-xs text-text-muted">
        Ready to screen a real applicant?
      </p>
      <div className="flex gap-2">
        <Link href="/pricing" className="btn-secondary flex-1 text-center">
          Pricing
        </Link>
        <Link href="/signup?next=/screen" className="btn-primary flex-1 text-center">
          Get started
        </Link>
      </div>
    </div>
  );
}
