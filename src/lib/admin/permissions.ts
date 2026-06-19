import { isAdminEmail } from "@/lib/admin/emails";

export function canDeleteAdminUser(params: {
  actorId: string;
  targetId: string;
  targetEmail: string | null;
}): { allowed: boolean; reason?: string } {
  if (params.actorId === params.targetId) {
    return {
      allowed: false,
      reason: "You cannot delete your own account from admin.",
    };
  }
  if (isAdminEmail(params.targetEmail)) {
    return {
      allowed: false,
      reason: "Admin accounts cannot be deleted here.",
    };
  }
  return { allowed: true };
}
