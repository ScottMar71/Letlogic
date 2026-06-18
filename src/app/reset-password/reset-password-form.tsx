"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogoLink } from "@/components/brand/logo";
import { updatePassword } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";

type ResetPasswordFormProps = {
  hasSession: boolean;
};

export function ResetPasswordForm({ hasSession }: ResetPasswordFormProps) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
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
    formData.set("password", password);
    formData.set("next", next);

    const result = await updatePassword(formData);
    setLoading(false);

    if ("error" in result && result.error) {
      setError(result.error);
    }
  }

  if (!hasSession) {
    return (
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div>
          <LogoLink size="lg" />
          <h1 className="mt-4 text-2xl font-semibold text-text">
            Reset link expired
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            This password reset link is invalid or has already been used.
            Request a new one to continue.
          </p>
        </div>
        <Link href="/forgot-password" className="btn-primary block w-full text-center">
          Request new reset link
        </Link>
        <p className="text-center text-sm text-text-muted">
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div>
        <LogoLink size="lg" />
        <h1 className="mt-4 text-2xl font-semibold text-text">Choose a new password</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1">
          <span className="field-label">New password</span>
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
          <span className="field-label">Confirm new password</span>
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
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
