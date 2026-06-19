"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUser, grantFreeCredit } from "@/app/actions/admin";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";

type AdminUserActionsProps = {
  userId: string;
  userEmail: string | null;
  userName: string | null;
  canDelete: boolean;
  deleteDisabledReason?: string;
};

function displayName(userName: string | null, userEmail: string | null) {
  return userName?.trim() || userEmail || "this user";
}

export function AdminUserActions({
  userId,
  userEmail,
  userName,
  canDelete,
  deleteDisabledReason,
}: AdminUserActionsProps) {
  const router = useRouter();
  const [grantOpen, setGrantOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState<"grant" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const label = displayName(userName, userEmail);
  const emailSuffix = userEmail ? ` (${userEmail})` : "";

  async function handleGrant() {
    setLoading("grant");
    setError(null);
    const result = await grantFreeCredit(userId);
    setLoading(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setGrantOpen(false);
    router.refresh();
  }

  async function handleDelete() {
    setLoading("delete");
    setError(null);
    const result = await deleteUser(userId);
    setLoading(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDeleteOpen(false);
    router.refresh();
  }

  function closeGrant() {
    if (loading === "grant") return;
    setGrantOpen(false);
    setError(null);
  }

  function closeDelete() {
    if (loading === "delete") return;
    setDeleteOpen(false);
    setError(null);
  }

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="secondary"
          className="whitespace-nowrap"
          aria-label={`Add free credit for ${label}`}
          onClick={() => {
            setError(null);
            setGrantOpen(true);
          }}
        >
          Add credit
        </Button>
        <Button
          variant="ghost"
          className="whitespace-nowrap text-danger hover:bg-danger-bg"
          aria-label={`Delete user ${label}`}
          disabled={!canDelete}
          title={!canDelete ? deleteDisabledReason : undefined}
          onClick={() => {
            setError(null);
            setDeleteOpen(true);
          }}
        >
          Delete
        </Button>
      </div>

      <ConfirmDialog
        open={grantOpen}
        title="Add free credit?"
        description={
          <>
            Grant <span className="font-medium text-text">1 credit</span> to{" "}
            <span className="font-medium text-text">
              {label}
              {emailSuffix}
            </span>
            . Their balance will update immediately.
          </>
        }
        confirmLabel="Add credit"
        loading={loading === "grant"}
        error={grantOpen ? error : null}
        onCancel={closeGrant}
        onConfirm={handleGrant}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this user?"
        description={
          <>
            This permanently removes{" "}
            <span className="font-medium text-text">
              {label}
              {emailSuffix}
            </span>{" "}
            and all their data — properties, screenings, credits, and billing
            records. Active subscriptions will be canceled. This cannot be
            undone.
          </>
        }
        confirmLabel="Delete user"
        confirmVariant="destructive"
        loading={loading === "delete"}
        error={deleteOpen ? error : null}
        onCancel={closeDelete}
        onConfirm={handleDelete}
      />
    </>
  );
}
