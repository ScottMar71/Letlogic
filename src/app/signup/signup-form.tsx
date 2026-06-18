"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogoLink } from "@/components/brand/logo";
import { signUpWithPassword } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";

export function SignupForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("next", next);

    const result = await signUpWithPassword(formData);
    setLoading(false);

    if ("error" in result && result.error) {
      setError(result.error);
    }
  }

  const loginHref =
    next === "/"
      ? "/login"
      : `/login?next=${encodeURIComponent(next)}`;

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div>
        <LogoLink size="lg" />
        <h1 className="mt-4 text-2xl font-semibold text-text">Create account</h1>
        <p className="mt-1 text-sm text-text-muted">
          Sign up with your email and a password to start screening applicants.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1">
          <span className="field-label">Email</span>
          <input
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
        <label className="block space-y-1">
          <span className="field-label">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="At least 6 characters"
          />
        </label>
        <label className="block space-y-1">
          <span className="field-label">Confirm password</span>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            placeholder="Re-enter your password"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-primary w-full"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
