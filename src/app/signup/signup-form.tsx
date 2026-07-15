"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { LogoLink } from "@/components/brand/logo";
import { signUpWithPassword } from "@/app/actions/auth";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/auth/turnstile-widget";
import { trackFunnel } from "@/lib/analytics/funnel";
import { captchaRequired } from "@/lib/auth/captcha";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/screen";
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{
    password?: string;
    confirm?: string;
  }>({});
  const [confirmationSent, setConfirmationSent] = useState(false);

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

    const result = await signUpWithPassword(formData);
    setLoading(false);
    turnstileRef.current?.reset();

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    if ("needsEmailConfirmation" in result && result.needsEmailConfirmation) {
      trackFunnel("signup_completed");
      setConfirmationSent(true);
      return;
    }

    if ("success" in result && result.success) {
      trackFunnel("signup_completed");
      router.push(result.next);
    }
  }

  const loginHref =
    next === "/"
      ? "/login"
      : `/login?next=${encodeURIComponent(next)}`;

  if (confirmationSent) {
    return (
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div>
          <LogoLink size="lg" />
          <h1 className="mt-4 text-h1 font-semibold text-text">
            Check your email
          </h1>
        </div>
        <Alert variant="success" title="Account created">
          <p>
            We sent a confirmation link to{" "}
            <span className="font-medium text-text">{email}</span>. Open it to
            activate your account, then sign in with your password.
          </p>
        </Alert>
        <Link href={loginHref} className="btn-primary block w-full text-center">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div>
        <LogoLink size="lg" />
        <h1 className="mt-4 text-h1 font-semibold text-text">Create account</h1>
        <p className="mt-1 text-sm text-text-muted">
          Sign up with your email to start screening applicants.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <Alert variant="error">
            <p>{error}</p>
            {(error.includes("already exists") ||
              error.includes("Forgot password")) && (
              <p className="mt-2 text-sm">
                <Link href="/login" className="font-medium underline">
                  Sign in
                </Link>
                {" · "}
                <Link href="/forgot-password" className="font-medium underline">
                  Forgot password
                </Link>
              </p>
            )}
          </Alert>
        ) : null}

        <Field label="Email" htmlFor="signup-email">
          <input
            id="signup-email"
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

        <Field
          label="Password"
          htmlFor="signup-password"
          hint="At least 6 characters."
          error={fieldError.password}
        >
          <input
            id="signup-password"
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
          label="Confirm password"
          htmlFor="signup-confirm"
          error={fieldError.confirm}
        >
          <input
            id="signup-confirm"
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

        <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />
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
        <Link
          href={loginHref}
          className="font-medium text-brand-ink hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
