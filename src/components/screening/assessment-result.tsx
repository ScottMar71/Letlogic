"use client";

import {
  RECOMMENDATION_LABELS,
  RISK_LEVEL_LABELS,
  type AssessmentRecord,
} from "@/lib/screening/types";
import type { RiskLevel } from "@/lib/screening/schema";

type Props = {
  assessment: AssessmentRecord | null;
  loading: boolean;
  error: string | null;
};

const LOADING_STEPS = [
  "Calculating income multiple…",
  "Reviewing employment stability…",
  "Generating assessment…",
];

const riskStyles: Record<RiskLevel, string> = {
  low: "bg-success-bg text-success border-success-border",
  medium: "bg-warning-bg text-warning border-warning-border",
  high: "bg-danger-bg text-danger border-danger-border",
};

export function AssessmentResultPanel({ assessment, loading, error }: Props) {
  if (loading) {
    return (
      <div
        className="space-y-3 rounded-xl border border-border bg-surface p-6"
        aria-live="polite"
      >
        {LOADING_STEPS.map((step) => (
          <div key={step} className="flex items-center gap-2 text-sm text-text-subtle">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
            {step}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger-border bg-danger-bg p-6 text-sm text-danger">
        {error}
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-muted p-8 text-center text-sm text-text-subtle">
        Results will appear here after you analyse an applicant.
      </div>
    );
  }

  return (
    <div className="@container space-y-4">
      <div
        className={`flex items-center justify-between rounded-xl border p-5 ${riskStyles[assessment.risk_level]}`}
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-wide">
            {RISK_LEVEL_LABELS[assessment.risk_level]}
          </p>
          <p
            className="text-3xl font-bold"
            aria-label={`Risk score ${assessment.risk_score} out of 100, ${assessment.risk_level} risk`}
          >
            {assessment.risk_score}
            <span className="text-base font-normal">/100</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide opacity-70">
            Recommendation
          </p>
          <p className="font-semibold">
            {RECOMMENDATION_LABELS[assessment.recommendation]}
          </p>
        </div>
      </div>

      <Card>
        <p className="text-sm text-text-muted">{assessment.summary}</p>
      </Card>

      <div className="grid gap-4 @md:grid-cols-2">
        <Card title="Strengths">
          <BulletList items={assessment.pros} empty="None identified." tone="pro" />
        </Card>
        <Card title="Concerns">
          <BulletList items={assessment.cons} empty="None identified." tone="con" />
        </Card>
      </div>

      {assessment.conditions.length > 0 && (
        <Card title="Suggested conditions">
          <BulletList items={assessment.conditions} empty="" tone="neutral" />
        </Card>
      )}

      {assessment.suggested_questions.length > 0 && (
        <Card title="Questions to ask / checks to run">
          <ol className="list-decimal space-y-1 pl-5 text-sm text-text-muted">
            {assessment.suggested_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </Card>
      )}

      {assessment.data_gaps.length > 0 && (
        <div className="rounded-xl border border-warning-border bg-warning-bg p-4">
          <p className="text-sm font-medium text-warning">Data gaps</p>
          <BulletList items={assessment.data_gaps} empty="" tone="neutral" />
        </div>
      )}

      <details className="rounded-xl border border-border bg-surface p-4">
        <summary className="cursor-pointer text-sm font-medium text-text">
          How we calculated this
        </summary>
        <ul className="mt-2 space-y-1 text-sm text-text-muted">
          <li>
            Income multiple:{" "}
            {assessment.metrics.incomeMultiple != null
              ? `${assessment.metrics.incomeMultiple}x`
              : "not computable"}
          </li>
          <li>
            Job stability score:{" "}
            {assessment.metrics.jobStabilityScore != null
              ? `${assessment.metrics.jobStabilityScore}/10`
              : "unknown"}
          </li>
          <li>
            Tenancy stability score:{" "}
            {assessment.metrics.tenancyStabilityScore != null
              ? `${assessment.metrics.tenancyStabilityScore}/10`
              : "unknown"}
          </li>
        </ul>
      </details>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      {title && (
        <p className="mb-2 text-sm font-semibold text-text">{title}</p>
      )}
      {children}
    </div>
  );
}

function BulletList({
  items,
  empty,
  tone,
}: {
  items: string[];
  empty: string;
  tone: "pro" | "con" | "neutral";
}) {
  if (items.length === 0) {
    return empty ? <p className="text-sm text-text-subtle">{empty}</p> : null;
  }
  const marker =
    tone === "pro" ? "text-success" : tone === "con" ? "text-danger" : "text-text-subtle";
  return (
    <ul className="space-y-1 text-sm text-text-muted">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className={marker}>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
