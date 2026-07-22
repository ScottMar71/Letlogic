import Link from "next/link";
import { Field } from "@/components/ui/field";
import { PdfUploadButton } from "@/components/screening/pdf-upload-button";

const PASTE_HINTS = [
  "Employment and income details",
  "Current address and rental history",
  "Any disclosed debts or adverse credit",
  "References or guarantor information",
];

type ScreeningPastePanelProps = {
  rawText: string;
  loading: boolean;
  onRawTextChange: (text: string) => void;
  onExtracted: (text: string) => void;
};

export function ScreeningPastePanel({
  rawText,
  loading,
  onRawTextChange,
  onExtracted,
}: ScreeningPastePanelProps) {
  return (
    <div className="mt-4 space-y-2">
      <PdfUploadButton disabled={loading} onExtracted={onExtracted} />
      <Field
        label="Application text"
        htmlFor="application-text"
        hint="Paste an email, online form, or your notes."
      >
        <textarea
          id="application-text"
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
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
          className="mt-2 inline-block text-xs font-medium text-brand-ink underline"
        >
          View a sample report
        </Link>
      </div>
    </div>
  );
}
