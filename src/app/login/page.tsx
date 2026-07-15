import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "./login-form";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Sign in");

export default function LoginPage() {
  return (
    <AuthPageShell mode="sign-in">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
