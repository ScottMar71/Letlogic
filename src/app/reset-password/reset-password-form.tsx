"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogoLink } from "@/components/brand/logo";
import { updatePassword } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";

type ResetPasswordFormProps = {
  hasSession: boolean;
};

export function ResetPasswordForm({ hasSession }: ResetPasswordFormProps) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{
    password?: string;
    confirm?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldError({});

    if (password.length < 6) {
      setLoading(false);
      setFieldError({ password: "Use at least 6 characters." });
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setFieldError({ confirm: "Passwords do not match." });
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
          <h1 className="mt-4 text-h1 font-semibold text-text">
            Reset link expired
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            This password reset link is invalid or has already been used.
            Request a new one to continue.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="btn-primary block w-full text-center"
        >
          Request new reset link
        </Link>
        <p className="text-center text-sm text-text-muted">
          <Link
            href="/login"
            className="font-medium text-brand-ink hover:underline"
          >
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
        <h1 className="mt-4 text-h1 font-semibold text-text">
          Choose a new password
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <Alert variant="error">{error}</Alert> : null}

        <Field
          label="New password"
          htmlFor="reset-password"
          hint="At least 6 characters."
          error={fieldError.password}
        >
          <input
            id="reset-password"
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </Field>

        <Field
          label="Confirm new password"
          htmlFor="reset-confirm"
          error={fieldError.confirm}
        >
          <input
            id="reset-confirm"
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-primary w-full"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
