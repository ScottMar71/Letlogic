"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { LogoLink } from "@/components/brand/logo";
import { requestPasswordReset } from "@/app/actions/auth";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/auth/turnstile-widget";
import { captchaRequired } from "@/lib/auth/captcha";
import { Alert } from "@/components/ui/alert";

export function ForgotPasswordForm() {
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (captchaRequired() && !captchaToken) {
      setLoading(false);
      setError("Please complete the security check and try again.");
      return;
    }

    const formData = new FormData();
    formData.set("email", email);
    if (captchaToken) formData.set("captchaToken", captchaToken);

    const result = await requestPasswordReset(formData);
    setLoading(false);
    turnstileRef.current?.reset();

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    setMessage(
      "If an account exists for that email, we sent a link to reset your password.",
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div>
        <LogoLink size="lg" />
        <h1 className="mt-4 text-2xl font-semibold text-text">Forgot password</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter your email and we&apos;ll send you a link to choose a new
          password.
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
        <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-primary w-full"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Back to sign in
        </Link>
      </p>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
