"use client";

import Link from "next/link";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-surface-muted px-4"
    >
      <div className="max-w-md space-y-4 rounded-xl border border-border bg-surface p-8 text-center">
        <h1 className="text-h1 font-bold text-text">Something went wrong</h1>
        <p className="text-sm text-text-muted">
          We hit an unexpected error. Please try again or return home.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
