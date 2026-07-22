import { Field } from "@/components/ui/field";

type ScreeningFormFieldProps = {
  label: string;
  fieldKey: string;
  form: Record<string, string>;
  onChange: (key: string, value: string) => void;
  type?: string;
};

export function ScreeningFormField({
  label,
  fieldKey,
  form,
  onChange,
  type = "text",
}: ScreeningFormFieldProps) {
  const id = `field-${fieldKey}`;
  return (
    <Field label={label} htmlFor={id}>
      <input
        id={id}
        type={type}
        value={form[fieldKey] ?? ""}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        className="input"
      />
    </Field>
  );
}
