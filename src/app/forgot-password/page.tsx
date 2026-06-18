import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "./forgot-password-form";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Forgot password");

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
