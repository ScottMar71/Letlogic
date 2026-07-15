"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { cancelIntakeLink } from "@/app/actions/intake";
import { formatDate } from "@/lib/format-date";
import { site } from "@/lib/site";
import type { IntakeLinkSummary } from "@/lib/screening/intake";

type IntakeLinksCardProps = {
  links: IntakeLinkSummary[];
};

type BadgeTone = "info" | "success" | "muted";

function statusLabel(link: IntakeLinkSummary): { label: string; tone: BadgeTone } {
  if (link.status === "submitted") return { label: "Ready to review", tone: "success" };
  if (link.status === "screened") return { label: "Screened", tone: "muted" };
  if (link.expired) return { label: "Expired", tone: "muted" };
  return { label: "Awaiting applicant", tone: "info" };
}

const toneClass: Record<BadgeTone, string> = {
  info: "bg-info-bg text-info border border-info-border",
  success: "bg-success-bg text-success border border-success-border",
  muted: "bg-surface-muted text-text-muted border border-border",
};

export function IntakeLinksCard({ links }: IntakeLinksCardProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function copy(link: IntakeLinkSummary) {
    await navigator.clipboard.writeText(`${site.url}/apply/${link.token}`);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function cancel(link: IntakeLinkSummary) {
    setCancellingId(link.id);
    await cancelIntakeLink(link.id);
    setCancellingId(null);
    router.refresh();
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="section-label">Applicant forms</h2>
        <Link
          href="/screen"
          className="text-sm font-medium text-brand-600 underline hover:text-brand-500"
        >
          Send a new form
        </Link>
      </div>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {links.map((link) => {
          const status = statusLabel(link);
          const active = link.status === "pending" && !link.expired;
          return (
            <li
              key={link.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-text">
                  {link.applicantName ?? "Awaiting applicant details"}
                </p>
                <p className="text-xs text-text-subtle">
                  {link.propertyLabel ? `${link.propertyLabel} · ` : ""}
                  {link.status === "submitted" && link.submittedAt
                    ? `Submitted ${formatDate(link.submittedAt)}`
                    : `Sent ${formatDate(link.createdAt)}`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${toneClass[status.tone]}`}
                >
                  {status.label}
                </span>
                {link.status === "submitted" && (
                  <Link href={`/screen?intake=${link.id}`} className="btn-primary text-sm">
                    Review &amp; screen
                  </Link>
                )}
                {active && (
                  <>
                    <button
                      type="button"
                      onClick={() => copy(link)}
                      className="btn-secondary inline-flex items-center gap-1.5 text-sm"
                    >
                      {copiedId === link.id ? (
                        <Check className="h-3.5 w-3.5 text-success" aria-hidden />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {copiedId === link.id ? "Copied" : "Copy link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => cancel(link)}
                      disabled={cancellingId === link.id}
                      className="btn-ghost text-sm"
                    >
                      {cancellingId === link.id ? "Cancelling…" : "Cancel"}
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
