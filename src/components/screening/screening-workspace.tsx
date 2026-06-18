"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardPaste, ListChecks } from "lucide-react";
import { analyseApplicant, type AnalyseResult } from "@/app/actions/screening";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { PdfUploadButton } from "@/components/screening/pdf-upload-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { ApplicationSource } from "@/lib/screening/queries";
import type { AssessmentRecord } from "@/lib/screening/types";

type WorkspaceProps = {
  propertyId?: string;
  defaultRent?: number;
  reanalyseFrom?: ApplicationSource;
};

type Mode = "paste" | "form";

const PASTE_HINTS = [
  "Employment and income details",
  "Current address and rental history",
  "Any disclosed debts or adverse credit",
  "References or guarantor information",
];

export function ScreeningWorkspace({
  propertyId,
  defaultRent,
  reanalyseFrom,
}: WorkspaceProps) {
  const router = useRouter();
  const resultsRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>(reanalyseFrom?.inputMode ?? "paste");
  const [applicantName, setApplicantName] = useState(
    reanalyseFrom?.applicantName ?? "",
  );
  const [rent, setRent] = useState(
    reanalyseFrom?.rentAmount != null
      ? String(reanalyseFrom.rentAmount)
      : defaultRent
        ? String(defaultRent)
        : "",
  );
  const [income, setIncome] = useState(
    reanalyseFrom?.monthlyIncome != null
      ? String(reanalyseFrom.monthlyIncome)
      : "",
  );
  const [rawText, setRawText] = useState(reanalyseFrom?.rawText ?? "");
  const [form, setForm] = useState<Record<string, string>>(
    reanalyseFrom?.structuredData ?? {},
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showBuy, setShowBuy] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const incomeMultiple = useMemo(() => {
    const rentAmount = Number(rent);
    const monthlyIncome = Number(income);
    if (rentAmount > 0 && monthlyIncome > 0) {
      return Math.round((monthlyIncome / rentAmount) * 100) / 100;
    }
    return null;
  }, [rent, income]);

  function buildInput() {
    const base = {
      applicantName,
      propertyId,
      existingApplicationId: reanalyseFrom?.applicationId,
      rentAmount: rent,
      applicantMonthlyIncome: income || undefined,
    };
    if (mode === "paste") return { ...base, inputMode: "paste" as const, rawText };
    return {
      ...base,
      inputMode: "form" as const,
      householdSize: form.householdSize || undefined,
      employmentStatus: form.employmentStatus || undefined,
      jobTitle: form.jobTitle || undefined,
      employer: form.employer || undefined,
      monthsInJob: form.monthsInJob || undefined,
      declaredDebts: form.declaredDebts || undefined,
      adverseCredit: form.adverseCredit || undefined,
      currentAddress: form.currentAddress || undefined,
      monthsAtCurrentAddress: form.monthsAtCurrentAddress || undefined,
      previousLandlordReference: form.previousLandlordReference || undefined,
    };
  }

  async function analyse() {
    setLoading(true);
    setError(null);
    setAssessment(null);
    setSavedId(null);
    const result: AnalyseResult = await analyseApplicant(buildInput());
    setLoading(false);

    if (result.ok) {
      setAssessment(result.assessment);
      setSavedId(result.assessment.id);
      setCollapsed(true);
      router.refresh();
      return;
    }
    if (result.code === "NO_CREDITS") {
      setShowBuy(true);
      return;
    }
    setError(result.error);
  }

  useEffect(() => {
    if (savedId && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [savedId]);

  const canAnalyse = applicantName.trim().length >= 2 && Number(rent) > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section className={`space-y-4 ${collapsed ? "lg:block" : ""}`}>
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="text-sm font-medium text-brand-600 underline hover:text-brand-500 lg:hidden"
          >
            Edit applicant details
          </button>
        )}

        <div className={collapsed ? "hidden lg:block" : ""}>
          <SegmentedControl
            aria-label="Input mode"
            options={[
              {
                value: "paste",
                label: "Paste application",
                icon: ClipboardPaste,
                description: "Email, PDF text, or notes",
              },
              {
                value: "form",
                label: "Structured form",
                icon: ListChecks,
                description: "Fill in fields step by step",
              },
            ]}
            value={mode}
            onChange={setMode}
          />

          <div className="mt-4 space-y-3">
            <p className="section-label">Property context</p>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field
                  label="Applicant name"
                  htmlFor="applicant-name"
                  hint="Who you're screening."
                >
                  <input
                    id="applicant-name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="input"
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field
                  label="Monthly rent (£)"
                  htmlFor="monthly-rent"
                  hint="The rent for this tenancy."
                >
                  <input
                    id="monthly-rent"
                    type="number"
                    min="0"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    className="input"
                    placeholder="1200"
                  />
                </Field>
                <Field
                  label="Applicant monthly income (£)"
                  htmlFor="applicant-income"
                  hint="Net take-home pay per month."
                >
                  <input
                    id="applicant-income"
                    type="number"
                    min="0"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="input"
                    placeholder="3600"
                  />
                </Field>
              </div>
              {incomeMultiple != null && (
                <p className="mt-3 border-t border-border pt-3 text-sm text-text-muted">
                  Income multiple:{" "}
                  <span className="font-medium text-text">
                    {incomeMultiple}×
                  </span>
                  <span className="text-text-subtle">
                    {" "}
                    — income is {incomeMultiple}× the monthly rent
                  </span>
                </p>
              )}
            </div>
          </div>

          {mode === "paste" ? (
            <div className="mt-4 space-y-2">
              <PdfUploadButton
                disabled={loading}
                onExtracted={(text) => {
                  setRawText(text);
                  setMode("paste");
                }}
              />
              <Field
                label="Application text"
                hint="Paste an email, online form, or your notes."
              >
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={12}
                  className="textarea"
                  placeholder="Paste the tenant's application, email, or notes here…"
                />
              </Field>
              <div className="rounded-lg border border-info-border bg-info-bg p-3">
                <p className="text-xs font-medium text-info">What to include</p>
                <ul className="mt-1 space-y-0.5 text-xs text-text-muted">
                  {PASTE_HINTS.map((h) => (
                    <li key={h}>· {h}</li>
                  ))}
                </ul>
                <Link
                  href="/sample"
                  className="mt-2 inline-block text-xs font-medium text-brand-600 underline"
                >
                  View a sample report
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="section-label">Applicant details</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormInput label="Employment status" k="employmentStatus" form={form} set={setField} />
                <FormInput label="Job title" k="jobTitle" form={form} set={setField} />
                <FormInput label="Employer" k="employer" form={form} set={setField} />
                <FormInput label="Months in current job" k="monthsInJob" form={form} set={setField} type="number" />
                <FormInput label="Household size" k="householdSize" form={form} set={setField} type="number" />
                <FormInput label="Declared debts (£)" k="declaredDebts" form={form} set={setField} type="number" />
                <FormInput label="Months at current address" k="monthsAtCurrentAddress" form={form} set={setField} type="number" />
                <FormInput label="Disclosed CCJ/bankruptcy" k="adverseCredit" form={form} set={setField} />
                <FormInput label="Current address" k="currentAddress" form={form} set={setField} />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={analyse}
            disabled={!canAnalyse || loading}
            aria-busy={loading}
            aria-describedby={!canAnalyse ? "analyse-hint" : undefined}
            className="btn-primary sticky bottom-4 z-10 mt-4 w-full py-3 shadow-lg lg:static lg:shadow-none"
          >
            {loading ? "Analysing…" : "Analyse applicant · uses 1 credit"}
          </button>
          {!canAnalyse && (
            <p id="analyse-hint" className="text-xs text-text-subtle">
              Enter an applicant name and a monthly rent to analyse.
            </p>
          )}
        </div>
      </section>

      <section ref={resultsRef}>
        {savedId && (
          <Alert variant="success" className="mb-4">
            Assessment saved.{" "}
            <Link
              href={`/screenings/${savedId}`}
              className="font-medium underline"
            >
              View full report
            </Link>
          </Alert>
        )}
        <AssessmentResultPanel
          assessment={assessment}
          loading={loading}
          error={error}
        />
      </section>

      <BuyCreditsModal open={showBuy} onClose={() => setShowBuy(false)} />
    </div>
  );
}

function FormInput({
  label,
  k,
  form,
  set,
  type = "text",
}: {
  label: string;
  k: string;
  form: Record<string, string>;
  set: (k: string, v: string) => void;
  type?: string;
}) {
  const id = `field-${k}`;
  return (
    <Field label={label} htmlFor={id}>
      <input
        id={id}
        type={type}
        value={form[k] ?? ""}
        onChange={(e) => set(k, e.target.value)}
        className="input"
      />
    </Field>
  );
}
