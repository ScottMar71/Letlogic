import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignupForm } from "./signup-form";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Create account");

export default function SignupPage() {
  return (
    <AuthPageShell>
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthPageShell>
  );
}
