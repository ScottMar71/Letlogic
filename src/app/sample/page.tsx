import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { PrintReportHeader } from "@/components/screening/print-report-header";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { SampleViewTracker } from "@/components/onboarding/sample-view-tracker";
import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import type { AssessmentRecord } from "@/lib/screening/types";

export const metadata = marketingPageMetadata({
  title: "Sample report",
  description:
    "An example LetLogic tenant screening assessment — see the risk score, summary, and recommendation before you sign up.",
  path: "/sample",
});

const SAMPLE_SCREENED = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const SAMPLE: AssessmentRecord = {
  id: "sample",
  applicationId: "sample",
  applicantName: "Alex Morgan",
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
      <SampleViewTracker />
      <FunnelTracker event="sample_viewed" />
      <MarketingHeader width="narrow" />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[var(--container-narrow)] flex-1 space-y-8 px-4 py-8"
      >
        <PageHeader
          title={SAMPLE.applicantName}
          description={`Sample report · Screened ${SAMPLE_SCREENED} · 14 High Street, Bristol`}
          actions={
            <div className="flex flex-wrap gap-2">
              <Link href="/pricing" className="btn-secondary">
                See pricing
              </Link>
              <Link href="/login?next=/screen" className="btn-primary">
                Sign in to screen
              </Link>
            </div>
          }
        />

        <Alert variant="warning">
          This is an example report. Sign in and buy a credit to screen a real
          applicant.
        </Alert>

        <PrintReportHeader
          applicantName={SAMPLE.applicantName}
          screenedAt={SAMPLE_SCREENED}
        />

        <AssessmentResultPanel assessment={SAMPLE} loading={false} error={null} />

        <p className="text-xs text-text-subtle">
          AI-generated assessment — not a credit check or legal advice.
        </p>
      </main>

      <MarketingFooter />
    </div>
  );
}
