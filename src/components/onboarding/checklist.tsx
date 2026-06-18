"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

const STORAGE_KEY = "letlogic-onboarding-dismissed";
const SAMPLE_VIEWED_KEY = "letlogic-sample-viewed";

type OnboardingChecklistProps = {
  hasScreenings: boolean;
  hasProperties: boolean;
};

export function OnboardingChecklist({
  hasScreenings,
  hasProperties,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true);
  const [hasViewedSample, setHasViewedSample] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    setHasViewedSample(localStorage.getItem(SAMPLE_VIEWED_KEY) === "1");
  }, []);

  const steps = [
    {
      id: "sample",
      label: "View a sample report",
      done: hasViewedSample,
      href: "/sample",
    },
    {
      id: "screen",
      label: "Screen your first applicant",
      done: hasScreenings,
      href: "/screen",
    },
    {
      id: "property",
      label: "Add a property to track screenings",
      done: hasProperties,
      href: "/properties/new",
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const allDone = hasScreenings && hasProperties && hasViewedSample;

  if (dismissed || allDone) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  }

  const progress = Math.round((completed / steps.length) * 100);

  return (
    <Card className="border-brand-200 bg-brand-50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text">Get started with LetLogic</p>
          <p className="mt-1 text-sm text-text-muted">
            {completed} of {steps.length} steps complete
          </p>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Onboarding progress"
          >
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss onboarding"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-subtle hover:bg-surface"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {steps.map((step) => (
          <li key={step.id}>
            <Link
              href={step.href}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-surface"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  step.done
                    ? "bg-success-bg text-success"
                    : "bg-surface text-text-subtle"
                }`}
                aria-hidden
              >
                {step.done ? <Check className="h-3.5 w-3.5" /> : "○"}
              </span>
              <span className={step.done ? "text-text-subtle line-through" : "text-text"}>
                {step.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Call from the sample report page to mark onboarding progress. */
export function markSampleViewed(): void {
  localStorage.setItem(SAMPLE_VIEWED_KEY, "1");
}
