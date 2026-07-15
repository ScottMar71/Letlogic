"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Link2 } from "lucide-react";
import { createIntakeLink } from "@/app/actions/intake";
import { trackFunnel } from "@/lib/analytics/funnel";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type IntakeLinkPanelProps = {
  propertyId?: string;
};

export function IntakeLinkPanel({ propertyId }: IntakeLinkPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function create() {
    setLoading(true);
    setError(null);
    const result = await createIntakeLink({ propertyId });
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    trackFunnel("intake_link_created");
    setUrl(result.url);
  }

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-xl border border-border bg-surface-muted p-4">
        <p className="font-medium text-text">
          Let the applicant fill in their own details
        </p>
        <ul className="mt-2 space-y-1 text-sm text-text-muted">
          <li>· Share a secure link — no account needed for the applicant</li>
          <li>· They complete the structured form on their phone</li>
          <li>· You review their answers, then run the screening</li>
        </ul>
        <p className="mt-2 text-sm font-medium text-text">
          No credit is used until you run the screening.
        </p>
      </div>

      {url ? (
        <div className="space-y-3">
          <Alert variant="success">
            Link created — it's valid for 14 days.
          </Alert>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={url}
              aria-label="Applicant form link"
              className="input flex-1 text-sm"
              onFocus={(e) => e.target.select()}
            />
            <Button variant="secondary" onClick={copy} className="shrink-0">
              {copied ? (
                <Check className="h-4 w-4 text-success" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="text-sm text-text-muted">
            Send this link to your applicant by email, text, or WhatsApp.
            You'll see their submission on your{" "}
            <Link href="/dashboard" className="font-medium text-brand-ink underline">
              dashboard
            </Link>{" "}
            under &ldquo;Applicant forms&rdquo;.
          </p>
          <Button variant="ghost" onClick={create} loading={loading}>
            Create another link
          </Button>
        </div>
      ) : (
        <Button onClick={create} loading={loading} className="w-full py-3">
          <Link2 className="h-4 w-4" aria-hidden />
          Create shareable link
        </Button>
      )}

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
