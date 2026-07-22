import { Field } from "@/components/ui/field";
import { ScreeningFormField } from "@/components/screening/screening-form-field";

type ScreeningStructuredPanelProps = {
  form: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
};

export function ScreeningStructuredPanel({
  form,
  onFieldChange,
}: ScreeningStructuredPanelProps) {
  return (
    <div className="mt-4 space-y-3">
      <p className="section-label">Applicant details</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ScreeningFormField
          label="Employment status"
          fieldKey="employmentStatus"
          form={form}
          onChange={onFieldChange}
        />
        <ScreeningFormField
          label="Job title"
          fieldKey="jobTitle"
          form={form}
          onChange={onFieldChange}
        />
        <ScreeningFormField
          label="Employer"
          fieldKey="employer"
          form={form}
          onChange={onFieldChange}
        />
        <ScreeningFormField
          label="Months in current job"
          fieldKey="monthsInJob"
          form={form}
          onChange={onFieldChange}
          type="number"
        />
        <ScreeningFormField
          label="Household size"
          fieldKey="householdSize"
          form={form}
          onChange={onFieldChange}
          type="number"
        />
        <ScreeningFormField
          label="Declared debts (£)"
          fieldKey="declaredDebts"
          form={form}
          onChange={onFieldChange}
          type="number"
        />
        <ScreeningFormField
          label="Months at current address"
          fieldKey="monthsAtCurrentAddress"
          form={form}
          onChange={onFieldChange}
          type="number"
        />
        <ScreeningFormField
          label="Disclosed CCJ/bankruptcy"
          fieldKey="adverseCredit"
          form={form}
          onChange={onFieldChange}
        />
        <ScreeningFormField
          label="Current address"
          fieldKey="currentAddress"
          form={form}
          onChange={onFieldChange}
        />
      </div>
      <Field
        label="Previous landlord reference"
        htmlFor="field-previousLandlordReference"
        hint="What the applicant said about their previous landlord."
      >
        <textarea
          id="field-previousLandlordReference"
          value={form.previousLandlordReference ?? ""}
          onChange={(e) =>
            onFieldChange("previousLandlordReference", e.target.value)
          }
          rows={3}
          className="textarea"
        />
      </Field>
    </div>
  );
}
