import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { AuthConfirmForm } from "./auth-confirm-form";

export const metadata = privatePageMetadata("Confirm sign-in");

export default function AuthConfirmPage() {
  return (
    <AuthPageShell>
      <Suspense>
        <AuthConfirmForm />
      </Suspense>
    </AuthPageShell>
  );
}
