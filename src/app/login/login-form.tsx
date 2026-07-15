"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogoLink } from "@/components/brand/logo";
import { signInWithPassword } from "@/app/actions/auth";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/auth/turnstile-widget";
import { captchaRequired } from "@/lib/auth/captcha";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const authError = searchParams.get("error") === "auth";
  const recoveryReason = searchParams.get("reason") === "recovery";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
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

    if (captchaRequired() && !captchaToken) {
      setLoading(false);
      setError("Please complete the security check and try again.");
      return;
    }

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("next", next);
    if (captchaToken) formData.set("captchaToken", captchaToken);

    const result = await signInWithPassword(formData);
    setLoading(false);
    turnstileRef.current?.reset();

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
        <h1 className="mt-4 text-h1 font-semibold text-text">Sign in</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter your email and password to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <Alert variant="error">{error}</Alert> : null}

        <Field label="Email" htmlFor="login-email">
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
        </Field>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="login-password" className="field-label">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-ink hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            aria-invalid={error ? true : undefined}
          />
        </div>

        <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />
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
        <Link
          href={signupHref}
          className="font-medium text-brand-ink hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
