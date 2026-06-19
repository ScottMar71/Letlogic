"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminActor } from "@/lib/admin/guards";
import { canDeleteAdminUser } from "@/lib/admin/permissions";
import { deleteUserAccount } from "@/lib/admin/delete-user";
import { grantCredits } from "@/lib/screening/credits";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminActionResult =
  | { ok: true }
  | { ok: false; error: string };

const userIdSchema = z.string().uuid("Invalid user id.");

async function loadTargetProfile(userId: string) {
  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("id, email")
    .eq("id", userId)
    .maybeSingle();

  if (error) return { ok: false as const, error: "Could not load user." };
  if (!profile) return { ok: false as const, error: "User not found." };

  return { ok: true as const, profile, admin };
}

export async function grantFreeCredit(
  userId: string,
): Promise<AdminActionResult> {
  const actor = await requireAdminActor();
  if (!actor.ok) return { ok: false, error: actor.error };

  const parsed = userIdSchema.safeParse(userId);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid user id." };
  }

  const loaded = await loadTargetProfile(parsed.data);
  if (!loaded.ok) return loaded;

  try {
    await grantCredits(loaded.admin, loaded.profile.id, 1, "adjustment");
  } catch {
    return { ok: false, error: "Could not grant credit." };
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteUser(userId: string): Promise<AdminActionResult> {
  const actor = await requireAdminActor();
  if (!actor.ok) return { ok: false, error: actor.error };

  const parsed = userIdSchema.safeParse(userId);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid user id." };
  }

  const loaded = await loadTargetProfile(parsed.data);
  if (!loaded.ok) return loaded;

  const deleteGuard = canDeleteAdminUser({
    actorId: actor.userId,
    targetId: loaded.profile.id,
    targetEmail: loaded.profile.email,
  });
  if (!deleteGuard.allowed) {
    return { ok: false, error: deleteGuard.reason ?? "Cannot delete this user." };
  }

  const deleted = await deleteUserAccount(loaded.admin, loaded.profile.id);
  if (!deleted.ok) return deleted;

  revalidatePath("/admin");
  return { ok: true };
}
