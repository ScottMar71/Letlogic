import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { site } from "@/lib/site";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { Shield, Scale } from "lucide-react";

export const metadata = privatePageMetadata("Sign in");

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto grid min-h-screen max-w-5xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-border bg-brand-700 p-10 text-white lg:flex">
          <p className="text-xl font-bold">{site.name}</p>
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">
              Screen tenant applications with confidence
            </h1>
            <p className="text-brand-100">
              Explainable risk scores for UK landlords. Not a credit check —
              a faster way to decide.
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
            By signing in you agree to our{" "}
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

        <div className="flex items-center justify-center px-4 py-12">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
