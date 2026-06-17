import Link from "next/link";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <span className="font-semibold text-zinc-900">{site.name}</span>
          <Link href="/login" className="text-sm text-zinc-700 underline">
            Sign in
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-16 space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            AI compliance assistant for UK landlords
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl">
            Generate compliant document drafts, track deadlines, and avoid costly
            mistakes — starting with the documents landlords search for most.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/documents/section-21"
            className="rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-400 transition-colors"
          >
            <h2 className="font-semibold text-zinc-900">Section 21 Notice</h2>
            <p className="mt-2 text-sm text-zinc-600">
              England &amp; Wales · Preview free · Download from £6.99
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
