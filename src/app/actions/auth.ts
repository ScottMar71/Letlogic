"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin, safeNextPath } from "@/lib/request-origin";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const next = safeNextPath((formData.get("next") as string) || "/");

  if (!email) return { error: "Email is required" };

  const origin = getRequestOrigin(await headers());
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
