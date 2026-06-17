"use client";

import {
  RECOMMENDATION_LABELS,
  RISK_LEVEL_LABELS,
  type AssessmentRecord,
} from "@/lib/screening/types";
import type { RiskLevel } from "@/lib/screening/schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

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

function ResultSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-6" aria-live="polite">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-16 w-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      {LOADING_STEPS.map((step) => (
        <p key={step} className="text-sm text-text-subtle">{step}</p>
      ))}
    </div>
  );
}

export function AssessmentResultPanel({ assessment, loading, error }: Props) {
  if (loading) return <ResultSkeleton />;

  if (error) {
    return <Alert variant="error">{error}</Alert>;
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

      <Card padding="sm">
        <p className="text-sm text-text-muted">{assessment.summary}</p>
      </Card>

      <div className="grid gap-4 @md:grid-cols-2">
        <Card title="Strengths" padding="sm">
          <BulletList items={assessment.pros} empty="None identified." tone="pro" />
        </Card>
        <Card title="Concerns" padding="sm">
          <BulletList items={assessment.cons} empty="None identified." tone="con" />
        </Card>
      </div>

      {assessment.conditions.length > 0 && (
        <Card title="Suggested conditions" padding="sm">
          <BulletList items={assessment.conditions} empty="" tone="neutral" />
        </Card>
      )}

      {assessment.suggested_questions.length > 0 && (
        <Card title="Questions to ask / checks to run" padding="sm">
          <ol className="list-decimal space-y-1 pl-5 text-sm text-text-muted">
            {assessment.suggested_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </Card>
      )}

      {assessment.data_gaps.length > 0 && (
        <Alert variant="warning" title="Data gaps">
          <BulletList items={assessment.data_gaps} empty="" tone="neutral" />
        </Alert>
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
