import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-surface-muted px-4"
    >
      <div className="max-w-md space-y-4 rounded-xl border border-border bg-surface p-8 text-center">
        <h1 className="text-h1 font-bold text-text">Page not found</h1>
        <p className="text-sm text-text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
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
