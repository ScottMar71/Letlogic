"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  buildAuthCallbackUrl,
  getAuthRedirectOrigin,
  safeNextPath,
} from "@/lib/request-origin";
import { friendlyAuthError } from "@/lib/auth/errors";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { createClient } from "@/lib/supabase/server";

export async function signInWithPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = safeNextPath((formData.get("next") as string) || "/");

  if (!email) return { error: "Email is required" };
  if (!password) return { error: "Password is required" };

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: friendlyAuthError(error.message) };
  redirect(next);
}

export async function signUpWithPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = safeNextPath((formData.get("next") as string) || "/");

  if (!email) return { error: "Email is required" };
  if (!password) return { error: "Password is required" };

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: friendlyAuthError(error.message) };
  redirect(next);
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email is required" };

  const origin = getAuthRedirectOrigin(await headers());
  const redirectTo = buildAuthCallbackUrl(origin, "/reset-password");

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) return { error: friendlyAuthError(error.message) };
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const next = safeNextPath((formData.get("next") as string) || "/");

  if (!password) return { error: "Password is required" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error:
        "Your reset link has expired or is invalid. Request a new password reset.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: friendlyAuthError(error.message) };
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
