import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { Alert } from "@/components/ui/alert";
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
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <MarketingHeader width="narrow" />

      <main id="main-content" className="mx-auto w-full max-w-[var(--container-narrow)] flex-1 space-y-4 px-4 py-8">
        <Alert variant="warning">
          This is an example report. Sign in and buy a credit to screen a real applicant.
        </Alert>
        <h1 className="text-h1 font-bold text-text">Sample assessment</h1>
        <AssessmentResultPanel assessment={SAMPLE} loading={false} error={null} />
        <div className="flex flex-wrap gap-3">
          <Link href="/login?next=/screen" className="btn-primary px-5">
            Sign in to screen
          </Link>
          <Link href="/pricing" className="btn-secondary px-5">
            See pricing
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
