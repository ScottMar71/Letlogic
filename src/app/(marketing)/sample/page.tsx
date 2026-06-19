import Link from "next/link";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { PrintReportHeader } from "@/components/screening/print-report-header";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { SampleViewTracker } from "@/components/onboarding/sample-view-tracker";
import { SampleStickyCta } from "@/components/onboarding/sample-sticky-cta";
import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import type { AssessmentRecord } from "@/lib/screening/types";

export const metadata = marketingPageMetadata({
  title: "Sample tenant screening report",
  description:
    "See an example LetLogic tenant screening report — the risk score, plain-English summary, pros and cons, and recommendation — before you sign up to screen.",
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
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Sample report", path: "/sample" }])}
      />
      <SampleViewTracker />
      <FunnelTracker event="sample_viewed" />

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
              <Link href="/signup?next=/screen" className="btn-primary">
                Create account to screen
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

        <p className="pb-20 text-xs text-text-subtle sm:pb-0">
          AI-generated assessment — not a credit check or legal advice.
        </p>
      </main>
      <SampleStickyCta />
    </>
  );
}
