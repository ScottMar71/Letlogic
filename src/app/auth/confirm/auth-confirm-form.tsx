"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogoLink } from "@/components/brand/logo";
import { verifyRecoveryCode } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { safeNextPath } from "@/lib/request-origin";

function buildCallbackHref(
  tokenHash: string,
  type: string,
  next: string,
): string {
  const params = new URLSearchParams({
    token_hash: tokenHash,
    type,
    next,
  });
  return `/auth/callback?${params.toString()}`;
}

export function AuthConfirmForm() {
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get("token_hash") ?? "";
  const type = searchParams.get("type") ?? "";
  const next = safeNextPath(searchParams.get("next"));
  const isRecovery = type === "recovery";

  const continueHref = useMemo(() => {
    if (!tokenHash || !type) return null;
    return buildCallbackHref(tokenHash, type, next);
  }, [tokenHash, type, next]);

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("token", token);
    formData.set("next", next);

    const result = await verifyRecoveryCode(formData);
    setLoading(false);

    if ("error" in result && result.error) {
      setError(result.error);
    }
  }

  if (!isRecovery || !continueHref) {
    return (
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div>
          <LogoLink size="lg" />
          <h1 className="mt-4 text-2xl font-semibold text-text">Link not valid</h1>
          <p className="mt-1 text-sm text-text-muted">
            This confirmation link is missing required details. Request a new
            email and try again.
          </p>
        </div>
        <Link href="/forgot-password" className="btn-primary block w-full text-center">
          Request reset email
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
        <h1 className="mt-4 text-2xl font-semibold text-text">Reset your password</h1>
        <p className="mt-1 text-sm text-text-muted">
          Continue below to choose a new password. Some email apps open links
          automatically — using this button keeps your reset link valid.
        </p>
      </div>

      <Link href={continueHref} className="btn-primary block w-full text-center">
        Continue to reset password
      </Link>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-text-muted">Or use your code</span>
        </div>
      </div>

      <form onSubmit={handleCodeSubmit} className="space-y-4">
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
          <span className="field-label">Code from email</span>
          <input
            type="text"
            name="token"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="input font-mono tracking-widest"
            placeholder="12345678"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-secondary w-full"
        >
          {loading ? "Verifying…" : "Verify code"}
        </button>
      </form>

      {error && <Alert variant="error">{error}</Alert>}

      <p className="text-center text-sm text-text-muted">
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
