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

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const next = safeNextPath((formData.get("next") as string) || "/");

  if (!email) return { error: "Email is required" };

  const origin = getAuthRedirectOrigin(await headers());
  const emailRedirectTo = buildAuthCallbackUrl(origin, next);

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) return { error: friendlyAuthError(error.message) };
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
