import "server-only";

import { isAdminEmail } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export type AdminActor =
  | { ok: true; userId: string; email: string }
  | { ok: false; error: string };

export async function requireAdminActor(): Promise<AdminActor> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Please sign in." };
  if (!isAdminEmail(user.email)) return { ok: false, error: "Not authorized." };

  return { ok: true, userId: user.id, email: user.email ?? "" };
}
