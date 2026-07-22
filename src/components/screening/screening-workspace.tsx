"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardPaste, ListChecks, Send } from "lucide-react";
import { analyseApplicant, type AnalyseResult } from "@/app/actions/screening";
import { trackFunnel } from "@/lib/analytics/funnel";
import { BuyCreditsModal } from "@/components/screening/buy-credits-modal";
import { AssessmentResultPanel } from "@/components/screening/assessment-result";
import { IntakeLinkPanel } from "@/components/intake/intake-link-panel";
import { ScreeningPastePanel } from "@/components/screening/screening-paste-panel";
import { ScreeningPropertyContext } from "@/components/screening/screening-property-context";
import { ScreeningStructuredPanel } from "@/components/screening/screening-structured-panel";
import { Alert } from "@/components/ui/alert";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { IntakeSource } from "@/lib/screening/intake";
import type { ApplicationSource } from "@/lib/screening/queries";
import type { AssessmentRecord } from "@/lib/screening/types";

type WorkspaceProps = {
  propertyId?: string;
  defaultRent?: number;
  reanalyseFrom?: ApplicationSource;
  intakeFrom?: IntakeSource;
  isFirstScreening?: boolean;
  creditBalance?: number;
};

type Mode = "paste" | "form" | "link";

export function ScreeningWorkspace({
  propertyId,
  defaultRent,
  reanalyseFrom,
  intakeFrom,
  isFirstScreening = false,
  creditBalance = 1,
}: WorkspaceProps) {
  const router = useRouter();
  const resultsRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>(
    intakeFrom ? "form" : (reanalyseFrom?.inputMode ?? "paste"),
  );
  const [applicantName, setApplicantName] = useState(
    intakeFrom?.applicantName ?? reanalyseFrom?.applicantName ?? "",
  );
  const [rent, setRent] = useState(
    reanalyseFrom?.rentAmount != null
      ? String(reanalyseFrom.rentAmount)
      : intakeFrom?.rentAmount != null
        ? String(intakeFrom.rentAmount)
        : defaultRent
          ? String(defaultRent)
          : "",
  );
  const [income, setIncome] = useState(
    reanalyseFrom?.monthlyIncome != null
      ? String(reanalyseFrom.monthlyIncome)
      : intakeFrom?.monthlyIncome != null
        ? String(intakeFrom.monthlyIncome)
        : "",
  );
  const [rawText, setRawText] = useState(reanalyseFrom?.rawText ?? "");
  const [form, setForm] = useState<Record<string, string>>(
    intakeFrom?.structuredData ?? reanalyseFrom?.structuredData ?? {},
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showBuy, setShowBuy] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const incomeMultiple = useMemo(() => {
    const rentAmount = Number(rent);
    const monthlyIncome = Number(income);
    if (rentAmount > 0 && monthlyIncome > 0) {
      return Math.round((monthlyIncome / rentAmount) * 100) / 100;
    }
    return null;
  }, [rent, income]);

  function buildInput() {
    const base = {
      applicantName,
      propertyId: propertyId ?? intakeFrom?.propertyId ?? undefined,
      existingApplicationId: reanalyseFrom?.applicationId,
      intakeLinkId: intakeFrom?.intakeLinkId,
      rentAmount: rent,
      applicantMonthlyIncome: income || undefined,
    };
    if (mode === "paste") return { ...base, inputMode: "paste" as const, rawText };
    return {
      ...base,
      inputMode: "form" as const,
      householdSize: form.householdSize || undefined,
      employmentStatus: form.employmentStatus || undefined,
      jobTitle: form.jobTitle || undefined,
      employer: form.employer || undefined,
      monthsInJob: form.monthsInJob || undefined,
      declaredDebts: form.declaredDebts || undefined,
      adverseCredit: form.adverseCredit || undefined,
      currentAddress: form.currentAddress || undefined,
      monthsAtCurrentAddress: form.monthsAtCurrentAddress || undefined,
      previousLandlordReference: form.previousLandlordReference || undefined,
    };
  }

  async function analyse() {
    if (creditBalance <= 0) {
      setShowBuy(true);
      return;
    }
    if (!canAnalyse) return;

    setLoading(true);
    setError(null);
    setAssessment(null);
    setSavedId(null);
    const result: AnalyseResult = await analyseApplicant(buildInput());
    setLoading(false);

    if (result.ok) {
      setAssessment(result.assessment);
      setSavedId(result.assessment.id);
      setCollapsed(true);
      if (isFirstScreening) {
        trackFunnel("first_screen_complete");
      }
      router.refresh();
      return;
    }
    if (result.code === "NO_CREDITS") {
      setShowBuy(true);
      return;
    }
    setError(result.error);
  }

  useEffect(() => {
    if (savedId && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [savedId]);

  const hasPasteContent = rawText.trim().length >= 40;
  const filledFormFields = Object.values(form).filter((v) => v.trim().length > 0)
    .length;
  const hasFormContent = Number(income) > 0 || filledFormFields >= 2;
  const hasApplicationContent =
    mode === "paste" ? hasPasteContent : hasFormContent;
  const canAnalyse =
    applicantName.trim().length >= 2 &&
    Number(rent) > 0 &&
    hasApplicationContent;
  const outOfCredits = creditBalance <= 0;

  let analyseHint = "Enter an applicant name and a monthly rent to analyse.";
  if (outOfCredits) {
    analyseHint = "Buy at least one credit before analysing an applicant.";
  } else if (applicantName.trim().length < 2 || !(Number(rent) > 0)) {
    analyseHint = "Enter an applicant name and a monthly rent to analyse.";
  } else if (mode === "paste" && !hasPasteContent) {
    analyseHint =
      "Paste enough application detail (about a short paragraph) so the screening has something to analyse.";
  } else if (mode === "form" && !hasFormContent) {
    analyseHint =
      "Add monthly income or at least two applicant detail fields before analysing.";
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section className={`space-y-4 ${collapsed ? "lg:block" : ""}`}>
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="text-sm font-medium text-brand-ink underline hover:text-brand-ink-hover lg:hidden"
          >
            Edit applicant details
          </button>
        )}

        <div className={collapsed ? "hidden lg:block" : ""}>
          <SegmentedControl
            aria-label="Input mode"
            options={[
              {
                value: "paste",
                label: "Paste application",
                icon: ClipboardPaste,
                description: "Email, PDF text, or notes",
                badge: isFirstScreening && !intakeFrom ? "Recommended" : undefined,
              },
              {
                value: "form",
                label: "Structured form",
                icon: ListChecks,
                description: "Fill in fields yourself",
              },
              {
                value: "link",
                label: "Send to applicant",
                icon: Send,
                description: "They complete a form",
              },
            ]}
            value={mode}
            onChange={setMode}
          />

          {mode === "link" ? (
            <IntakeLinkPanel propertyId={propertyId} />
          ) : (
            <>
              <ScreeningPropertyContext
                applicantName={applicantName}
                rent={rent}
                income={income}
                incomeMultiple={incomeMultiple}
                onApplicantNameChange={setApplicantName}
                onRentChange={setRent}
                onIncomeChange={setIncome}
              />

              {mode === "paste" ? (
                <ScreeningPastePanel
                  rawText={rawText}
                  loading={loading}
                  onRawTextChange={setRawText}
                  onExtracted={(text) => {
                    setRawText(text);
                    setMode("paste");
                  }}
                />
              ) : (
                <ScreeningStructuredPanel form={form} onFieldChange={setField} />
              )}

              <button
                type="button"
                onClick={analyse}
                disabled={(!canAnalyse && !outOfCredits) || loading}
                aria-busy={loading}
                aria-describedby={
                  !canAnalyse || outOfCredits ? "analyse-hint" : undefined
                }
                className="btn-primary sticky bottom-4 z-10 mt-4 w-full py-3 shadow-lg lg:static lg:shadow-none"
              >
                {loading
                  ? "Analysing…"
                  : outOfCredits
                    ? "Buy credits to analyse"
                    : "Analyse applicant · uses 1 credit"}
              </button>
              {(!canAnalyse || outOfCredits) && (
                <p id="analyse-hint" className="text-xs text-text-subtle">
                  {analyseHint}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <section ref={resultsRef}>
        {savedId && (
          <Alert variant="success" className="mb-4">
            Assessment saved.{" "}
            <Link
              href={`/screenings/${savedId}`}
              className="font-medium underline"
            >
              View full report
            </Link>
          </Alert>
        )}
        <AssessmentResultPanel
          assessment={assessment}
          loading={loading}
          error={error}
        />
      </section>

      <BuyCreditsModal open={showBuy} onClose={() => setShowBuy(false)} />
    </div>
  );
}
