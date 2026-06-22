"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogoLink } from "@/components/brand/logo";
import { signInWithPassword } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const authError = searchParams.get("error") === "auth";
  const recoveryReason = searchParams.get("reason") === "recovery";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    authError
      ? recoveryReason
        ? "That password reset link has expired or was already used. Some email apps open links before you do — request a new reset email and tap Continue on the next page, or enter the code from the email there."
        : "That sign-in link is invalid or has expired. Sign in with your email and password instead."
      : null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("next", next);

    const result = await signInWithPassword(formData);
    setLoading(false);

    if ("error" in result && result.error) {
      setError(result.error);
    }
  }

  const signupHref =
    next === "/"
      ? "/signup"
      : `/signup?next=${encodeURIComponent(next)}`;

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div>
        <LogoLink size="lg" />
        <h1 className="mt-4 text-2xl font-semibold text-text">Sign in</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter your email and password to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="login-email" className="block space-y-1">
          <span className="field-label">Email</span>
          <input
            id="login-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </label>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Your password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-primary w-full"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href={signupHref} className="font-medium text-brand-600 hover:underline">
          Create one
        </Link>
      </p>

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
