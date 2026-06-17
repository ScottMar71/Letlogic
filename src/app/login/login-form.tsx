"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInWithEmail } from "@/app/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("next", next);

    const result = await signInWithEmail(formData);
    setLoading(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    setMessage("Check your email for a magic link to sign in.");
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
          ← LetLogic
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-600">
          We&apos;ll email you a magic link. No password needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm"
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send magic link"}
        </button>
      </form>

      {message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}
    </div>
  );
}
