import { site } from "@/lib/site";

type PrintReportHeaderProps = {
  applicantName: string;
  screenedAt: string;
  showBranding?: boolean;
};

export function PrintReportHeader({
  applicantName,
  screenedAt,
  showBranding = true,
}: PrintReportHeaderProps) {
  if (!showBranding) return null;

  return (
    <div className="print-only mb-6 hidden border-b border-border pb-4 print:block">
      <p className="text-lg font-bold text-text">{site.name}</p>
      <p className="text-sm text-text-muted">Tenant screening report</p>
      <p className="mt-2 text-sm text-text">
        Applicant: <span className="font-medium">{applicantName}</span>
      </p>
      <p className="text-sm text-text-muted">Screened: {screenedAt}</p>
      <p className="mt-3 text-xs text-text-subtle">
        AI-generated screening aid — not a credit check, referencing report, or
        legal advice. {site.company.legalName}.
      </p>
    </div>
  );
}
