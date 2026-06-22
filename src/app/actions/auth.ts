"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  buildAuthCallbackUrl,
  buildAuthConfirmUrl,
  getAuthRedirectOrigin,
  safeNextPath,
} from "@/lib/request-origin";
import { checkCaptchaToken } from "@/lib/auth/captcha";
import { friendlyAuthError } from "@/lib/auth/errors";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { createClient } from "@/lib/supabase/server";

export async function signInWithPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = safeNextPath((formData.get("next") as string) || "/dashboard");

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
  const next = safeNextPath((formData.get("next") as string) || "/screen");

  if (!email) return { error: "Email is required" };
  if (!password) return { error: "Password is required" };

  const captcha = checkCaptchaToken(formData);
  if (!captcha.ok) return { error: captcha.error };

  const origin = getAuthRedirectOrigin(await headers());
  const emailRedirectTo = buildAuthCallbackUrl(origin, next);

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      ...(captcha.token ? { captchaToken: captcha.token } : {}),
    },
  });

  if (error) return { error: friendlyAuthError(error.message) };

  if (!data.session) {
    // Supabase returns an empty identities array when the email is already registered.
    if (!data.user?.identities?.length) {
      return {
        error:
          "An account with this email already exists. Sign in instead — or use Forgot password if you signed up before passwords were added.",
      };
    }

    return { needsEmailConfirmation: true as const };
  }

  return { success: true as const, next };
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email is required" };

  const captcha = checkCaptchaToken(formData);
  if (!captcha.ok) return { error: captcha.error };

  const origin = getAuthRedirectOrigin(await headers());
  const redirectTo = buildAuthConfirmUrl(origin, "/reset-password");

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
    ...(captcha.token ? { captchaToken: captcha.token } : {}),
  });

  if (error) return { error: friendlyAuthError(error.message) };
  return { success: true };
}

export async function verifyRecoveryCode(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const token = (formData.get("token") as string)?.trim();
  const next = safeNextPath((formData.get("next") as string) || "/reset-password");

  if (!email) return { error: "Email is required" };
  if (!token) return { error: "Enter the code from your reset email" };

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });

  if (error) return { error: friendlyAuthError(error.message) };
  redirect(next);
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const next = safeNextPath((formData.get("next") as string) || "/");

  if (!password) return { error: "Password is required" };

  const supabase = await createAuthClient();
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
