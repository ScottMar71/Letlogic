"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyseApplicant, type AnalyseResult } from "@/app/actions/screening";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import type { AssessmentRecord } from "@/lib/screening/types";

type WorkspaceProps = {
  propertyId?: string;
  defaultRent?: number;
  defaultIncomeMultiple?: number;
};

type Mode = "paste" | "form";

export function ScreeningWorkspace({
  propertyId,
  defaultRent,
  defaultIncomeMultiple = 2.5,
}: WorkspaceProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("paste");
  const [applicantName, setApplicantName] = useState("");
  const [rent, setRent] = useState(defaultRent ? String(defaultRent) : "");
  const [multiple, setMultiple] = useState(String(defaultIncomeMultiple));
  const [rawText, setRawText] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [showBuy, setShowBuy] = useState(false);

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildInput() {
    const base = {
      applicantName,
      propertyId,
      rentAmount: rent,
      requiredIncomeMultiple: multiple,
    };
    if (mode === "paste") return { ...base, inputMode: "paste" as const, rawText };
    return {
      ...base,
      inputMode: "form" as const,
      householdSize: form.householdSize || undefined,
      employmentStatus: form.employmentStatus || undefined,
      jobTitle: form.jobTitle || undefined,
      employer: form.employer || undefined,
      monthlyIncome: form.monthlyIncome || undefined,
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
    const result: AnalyseResult = await analyseApplicant(buildInput());
    setLoading(false);

    if (result.ok) {
      setAssessment(result.assessment);
      router.refresh();
      return;
    }
    if (result.code === "NO_CREDITS") {
      setShowBuy(true);
      return;
    }
    setError(result.error);
  }

  const canAnalyse = applicantName.trim().length >= 2 && Number(rent) > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section className="space-y-4">
        <div className="flex gap-2" role="tablist" aria-label="Input mode">
          {(["paste", "form"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`min-h-11 rounded-lg px-3 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-brand-600 text-white"
                  : "border border-border-strong text-text-muted hover:border-brand-600"
              }`}
            >
              {m === "paste" ? "Paste application" : "Structured form"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface-muted p-3 sm:grid-cols-2">
          <Field label="Applicant name">
            <input
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="input"
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Monthly rent (£)">
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="input"
              placeholder="1200"
            />
          </Field>
          <Field label="Required income multiple">
            <input
              type="number"
              step="0.1"
              value={multiple}
              onChange={(e) => setMultiple(e.target.value)}
              className="input"
            />
          </Field>
        </div>

        {mode === "paste" ? (
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={12}
            className="textarea"
            placeholder="Paste the tenant's application, email, or notes here…"
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormInput label="Employment status" k="employmentStatus" form={form} set={setField} />
            <FormInput label="Job title" k="jobTitle" form={form} set={setField} />
            <FormInput label="Employer" k="employer" form={form} set={setField} />
            <FormInput label="Net monthly income (£)" k="monthlyIncome" form={form} set={setField} type="number" />
            <FormInput label="Months in current job" k="monthsInJob" form={form} set={setField} type="number" />
            <FormInput label="Household size" k="householdSize" form={form} set={setField} type="number" />
            <FormInput label="Declared debts (£)" k="declaredDebts" form={form} set={setField} type="number" />
            <FormInput label="Months at current address" k="monthsAtCurrentAddress" form={form} set={setField} type="number" />
            <FormInput label="Disclosed CCJ/bankruptcy" k="adverseCredit" form={form} set={setField} />
            <FormInput label="Current address" k="currentAddress" form={form} set={setField} />
          </div>
        )}

        <button
          type="button"
          onClick={analyse}
          disabled={!canAnalyse || loading}
          aria-describedby={!canAnalyse ? "analyse-hint" : undefined}
          className="btn-primary w-full py-3"
        >
          {loading ? "Analysing…" : "Analyse applicant · uses 1 credit"}
        </button>
        {!canAnalyse && (
          <p id="analyse-hint" className="text-xs text-text-subtle">
            Enter an applicant name and a monthly rent to analyse.
          </p>
        )}
      </section>

      <section>
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="field-label">{label}</span>
      {children}
    </label>
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
  return (
    <Field label={label}>
      <input
        type={type}
        value={form[k] ?? ""}
        onChange={(e) => set(k, e.target.value)}
        className="input"
      />
    </Field>
  );
}
