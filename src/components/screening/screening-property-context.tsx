import { Field } from "@/components/ui/field";

type ScreeningPropertyContextProps = {
  applicantName: string;
  rent: string;
  income: string;
  incomeMultiple: number | null;
  onApplicantNameChange: (value: string) => void;
  onRentChange: (value: string) => void;
  onIncomeChange: (value: string) => void;
};

export function ScreeningPropertyContext({
  applicantName,
  rent,
  income,
  incomeMultiple,
  onApplicantNameChange,
  onRentChange,
  onIncomeChange,
}: ScreeningPropertyContextProps) {
  return (
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
              onChange={(e) => onApplicantNameChange(e.target.value)}
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
              onChange={(e) => onRentChange(e.target.value)}
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
              onChange={(e) => onIncomeChange(e.target.value)}
              className="input"
              placeholder="3600"
            />
          </Field>
        </div>
        {incomeMultiple != null && (
          <p className="mt-3 border-t border-border pt-3 text-sm text-text-muted">
            Income multiple:{" "}
            <span className="font-medium text-text">{incomeMultiple}×</span>
            <span className="text-text-subtle">
              {" "}
              — income is {incomeMultiple}× the monthly rent
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
