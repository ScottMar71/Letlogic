import { cache } from "react";
import { getCreditBalance } from "@/lib/screening/credits";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/** Dedupes auth lookup within a single request (layout + page + header). */
export const getAuthenticatedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Dedupes credit balance fetch when header and page both need it. */
export const getCachedCreditBalance = cache(async (): Promise<number | undefined> => {
  const user = await getAuthenticatedUser();
  if (!user) return undefined;
  return getCreditBalance(createAdminClient(), user.id);
});
