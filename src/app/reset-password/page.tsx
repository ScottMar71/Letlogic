import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "./reset-password-form";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata = privatePageMetadata("Reset password");

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthPageShell>
      <Suspense>
        <ResetPasswordForm hasSession={!!user} />
      </Suspense>
    </AuthPageShell>
  );
}
