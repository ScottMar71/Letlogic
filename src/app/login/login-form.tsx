"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogoLink } from "@/components/brand/logo";
import { signInWithEmail } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const authError = searchParams.get("error") === "auth";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    authError
      ? "That sign-in link is invalid or has expired. Request a new magic link."
      : null,
  );

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
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div>
        <LogoLink size="sm" />
        <h1 className="mt-4 text-2xl font-semibold text-text">Sign in</h1>
        <p className="mt-1 text-sm text-text-muted">
          We&apos;ll email you a magic link. No password needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1">
          <span className="field-label">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-primary w-full"
        >
          {loading ? "Sending…" : "Send magic link"}
        </button>
      </form>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
