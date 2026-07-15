import Link from "next/link";
import { Shield, Scale } from "lucide-react";
import { site } from "@/lib/site";

type AuthPageShellProps = {
  children: React.ReactNode;
  /** Controls mobile terms wording. */
  mode?: "sign-in" | "sign-up" | "other";
};

export function AuthPageShell({
  children,
  mode = "other",
}: AuthPageShellProps) {
  const agreeVerb =
    mode === "sign-up"
      ? "By creating an account"
      : mode === "sign-in"
        ? "By signing in"
        : "By continuing";

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto grid min-h-screen max-w-5xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-border bg-brand-700 p-10 text-white lg:flex">
          <Link href="/" className="text-xl font-bold hover:underline">
            {site.name}
          </Link>
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">
              Screen tenant applications with confidence
            </h1>
            <p className="text-brand-100">
              Explainable risk scores for UK landlords. Not a credit check — a
              faster way to decide.
            </p>
            <ul className="space-y-3 text-sm text-brand-100">
              <li className="flex gap-2">
                <Shield className="h-5 w-5 shrink-0" aria-hidden />
                UK-focused with transparent data handling
              </li>
              <li className="flex gap-2">
                <Scale className="h-5 w-5 shrink-0" aria-hidden />
                Equality Act aware — you stay in control
              </li>
            </ul>
          </div>
          <p className="text-xs text-brand-200">
            {agreeVerb} you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <main
          id="main-content"
          className="flex flex-col items-center justify-center px-4 py-12"
        >
          <div className="mb-6 w-full max-w-md space-y-3 rounded-xl border border-border bg-surface p-4 text-sm text-text-muted lg:hidden">
            <p className="font-medium text-text">
              {site.name} — UK tenant screening
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <Shield className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
                Transparent data handling
              </li>
              <li className="flex gap-2">
                <Scale className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
                Equality Act aware — you stay in control
              </li>
            </ul>
          </div>
          {children}
          <p className="mt-8 max-w-md text-center text-xs text-text-subtle lg:hidden">
            {agreeVerb} you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium text-brand-ink hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-brand-ink hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </main>
      </div>
    </div>
  );
}
