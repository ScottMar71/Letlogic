"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const next = (formData.get("next") as string) || "/";

  if (!email) return { error: "Email is required" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${site.url}/auth/callback?next=${encodeURIComponent(next)}`,
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
