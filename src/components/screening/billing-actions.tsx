"use client";

import { useState } from "react";
import {
  createBillingPortal,
  createProSubscription,
} from "@/app/actions/billing";

export function BillingActions({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(
    action: typeof createBillingPortal | typeof createProSubscription,
    key: string,
  ) {
    setLoading(key);
    setError(null);
    const result = await action();
    if (!result.ok) {
      setError(result.error);
      setLoading(null);
      return;
    }
    window.location.assign(result.url);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {!isPro && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => go(createProSubscription, "pro")}
            className="btn-primary"
          >
            {loading === "pro" ? "…" : "Upgrade to Pro"}
          </button>
        )}
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => go(createBillingPortal, "portal")}
          className="btn-secondary"
        >
          {loading === "portal" ? "…" : "Manage billing"}
        </button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
