"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitIntakeApplication } from "@/app/actions/intake";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

type ApplicantIntakeFormProps = {
  token: string;
  landlordLabel: string;
};

export function ApplicantIntakeForm({
  token,
  landlordLabel,
}: ApplicantIntakeFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    const result = await submitIntakeApplication(token, {
      applicantName: values.applicantName ?? "",
      monthlyIncome: values.monthlyIncome || undefined,
      employmentStatus: values.employmentStatus || undefined,
      jobTitle: values.jobTitle || undefined,
      employer: values.employer || undefined,
      monthsInJob: values.monthsInJob || undefined,
      householdSize: values.householdSize || undefined,
      declaredDebts: values.declaredDebts || undefined,
      adverseCredit: values.adverseCredit || undefined,
      currentAddress: values.currentAddress || undefined,
      monthsAtCurrentAddress: values.monthsAtCurrentAddress || undefined,
      previousLandlordReference: values.previousLandlordReference || undefined,
    });
    setLoading(false);

    if (result.ok) {
      setDone(true);
      return;
    }
    setError(result.error);
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-success-border bg-success-bg p-6 text-center"
      >
        <CheckCircle2 className="mx-auto h-8 w-8 text-success" aria-hidden />
        <h2 className="mt-3 text-lg font-semibold text-text">
          Application submitted
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Thanks — your answers have been shared with {landlordLabel}. They&apos;ll
          be in touch about the next steps.
        </p>
      </div>
    );
  }

  const canSubmit = (values.applicantName ?? "").trim().length >= 2;

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <section className="space-y-3">
        <p className="section-label">About you</p>
        <Field label="Full name" htmlFor="intake-applicantName" hint="Required.">
          <input
            id="intake-applicantName"
            value={values.applicantName ?? ""}
            onChange={(e) => set("applicantName", e.target.value)}
            className="input"
            autoComplete="name"
            required
          />
        </Field>
        <Field
          label="Household size"
          htmlFor="intake-householdSize"
          hint="How many people would live at the property, including you."
        >
          <input
            id="intake-householdSize"
            type="number"
            min="1"
            inputMode="numeric"
            value={values.householdSize ?? ""}
            onChange={(e) => set("householdSize", e.target.value)}
            className="input"
          />
        </Field>
      </section>

      <section className="space-y-3">
        <p className="section-label">Work and income</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Employment status" htmlFor="intake-employmentStatus">
            <input
              id="intake-employmentStatus"
              value={values.employmentStatus ?? ""}
              onChange={(e) => set("employmentStatus", e.target.value)}
              className="input"
              placeholder="e.g. Full-time employed"
            />
          </Field>
          <Field label="Job title" htmlFor="intake-jobTitle">
            <input
              id="intake-jobTitle"
              value={values.jobTitle ?? ""}
              onChange={(e) => set("jobTitle", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Employer" htmlFor="intake-employer">
            <input
              id="intake-employer"
              value={values.employer ?? ""}
              onChange={(e) => set("employer", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Months in current job" htmlFor="intake-monthsInJob">
            <input
              id="intake-monthsInJob"
              type="number"
              min="0"
              inputMode="numeric"
              value={values.monthsInJob ?? ""}
              onChange={(e) => set("monthsInJob", e.target.value)}
              className="input"
            />
          </Field>
        </div>
        <Field
          label="Monthly take-home income (£)"
          htmlFor="intake-monthlyIncome"
          hint="Your net income per month, after tax."
        >
          <input
            id="intake-monthlyIncome"
            type="number"
            min="0"
            inputMode="decimal"
            value={values.monthlyIncome ?? ""}
            onChange={(e) => set("monthlyIncome", e.target.value)}
            className="input"
            placeholder="2800"
          />
        </Field>
      </section>

      <section className="space-y-3">
        <p className="section-label">Renting history</p>
        <Field label="Current address" htmlFor="intake-currentAddress">
          <input
            id="intake-currentAddress"
            value={values.currentAddress ?? ""}
            onChange={(e) => set("currentAddress", e.target.value)}
            className="input"
            autoComplete="street-address"
          />
        </Field>
        <Field
          label="Months at current address"
          htmlFor="intake-monthsAtCurrentAddress"
        >
          <input
            id="intake-monthsAtCurrentAddress"
            type="number"
            min="0"
            inputMode="numeric"
            value={values.monthsAtCurrentAddress ?? ""}
            onChange={(e) => set("monthsAtCurrentAddress", e.target.value)}
            className="input"
          />
        </Field>
        <Field
          label="Previous landlord reference"
          htmlFor="intake-previousLandlordReference"
          hint="Optional — a contact or a short note about your last tenancy."
        >
          <textarea
            id="intake-previousLandlordReference"
            value={values.previousLandlordReference ?? ""}
            onChange={(e) => set("previousLandlordReference", e.target.value)}
            rows={3}
            className="textarea"
          />
        </Field>
      </section>

      <section className="space-y-3">
        <p className="section-label">Financial circumstances</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Monthly debt repayments (£)"
            htmlFor="intake-declaredDebts"
            hint="Loans, credit cards, car finance."
          >
            <input
              id="intake-declaredDebts"
              type="number"
              min="0"
              inputMode="decimal"
              value={values.declaredDebts ?? ""}
              onChange={(e) => set("declaredDebts", e.target.value)}
              className="input"
            />
          </Field>
          <Field
            label="CCJs or bankruptcy"
            htmlFor="intake-adverseCredit"
            hint="Leave blank if none."
          >
            <input
              id="intake-adverseCredit"
              value={values.adverseCredit ?? ""}
              onChange={(e) => set("adverseCredit", e.target.value)}
              className="input"
            />
          </Field>
        </div>
      </section>

      {error && <Alert variant="error">{error}</Alert>}

      <Button
        type="submit"
        className="w-full py-3"
        loading={loading}
        disabled={!canSubmit}
      >
        Submit application
      </Button>
      {!canSubmit && (
        <p className="text-xs text-text-subtle">
          Enter your full name to submit.
        </p>
      )}
      <p className="text-xs text-text-subtle">
        Only fill in what you&apos;re comfortable sharing — all fields except your
        name are optional. Your answers are sent to {landlordLabel} and are not
        used for a credit check.
      </p>
    </form>
  );
}
