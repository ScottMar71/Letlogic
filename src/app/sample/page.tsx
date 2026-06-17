import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import type { AssessmentRecord } from "@/lib/screening/types";

export const metadata = {
  title: "Sample report",
  description: "An example LetLogic tenant screening assessment.",
};

const SAMPLE: AssessmentRecord = {
  id: "sample",
  applicationId: "sample",
  applicantName: "Sample Applicant",
  risk_score: 28,
  risk_level: "low",
  recommendation: "proceed",
  summary:
    "Income comfortably covers the rent (3.2x) and employment is stable (4 years in role). No disclosed adverse credit. Rental history is solid with no gaps reported.",
  pros: [
    "Income multiple of 3.2x exceeds the required 2.5x",
    "Four years in current role — strong job stability",
    "No disclosed CCJs or bankruptcies",
  ],
  cons: ["Previous landlord reference not yet verified"],
  conditions: [],
  suggested_questions: [
    "Request proof of income for the last 3 months",
    "Confirm contact details for the previous landlord reference",
  ],
  data_gaps: ["Deposit funding source not stated"],
  metrics: {
    incomeMultiple: 3.2,
    jobStabilityScore: 8,
    tenancyStabilityScore: 6,
  },
  promptVersion: "v1",
  model: "gpt-4o",
  createdAt: new Date().toISOString(),
};

export default function SamplePage() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <MarketingHeader width="narrow" />

      <main className="mx-auto max-w-[var(--container-narrow)] space-y-4 px-4 py-8">
        <div className="rounded-lg border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning">
          This is an example report. Buy a credit to screen a real applicant.
        </div>
        <h1 className="text-2xl font-bold text-text">Sample assessment</h1>
        <AssessmentResultPanel assessment={SAMPLE} loading={false} error={null} />
        <Link href="/screen" className="btn-primary px-5">
          Screen an applicant
        </Link>
      </main>
    </div>
  );
}
