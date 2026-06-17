import type {
  AssessmentOutput,
  Recommendation,
  RiskLevel,
  ScreeningInput,
} from "@/lib/screening/schema";
import type { Metrics } from "@/lib/screening/metrics";

export type { AssessmentOutput, Recommendation, RiskLevel, ScreeningInput };

// An assessment as surfaced to the UI: the model output plus stored metadata.
export type AssessmentRecord = AssessmentOutput & {
  id: string;
  applicationId: string;
  applicantName: string;
  propertyId?: string | null;
  propertyAddress?: string | null;
  metrics: Metrics;
  promptVersion: string;
  model: string;
  createdAt: string;
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  proceed: "Proceed",
  proceed_with_conditions: "Proceed with conditions",
  do_not_proceed: "Do not proceed",
};
