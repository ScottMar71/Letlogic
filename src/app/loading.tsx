export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    </div>
  );
}
