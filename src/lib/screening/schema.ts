import { z } from "zod";

export const RISK_LEVELS = ["low", "medium", "high"] as const;
export const RECOMMENDATIONS = [
  "proceed",
  "proceed_with_conditions",
  "do_not_proceed",
] as const;

// Fields shared by both input modes. The screening is anchored to a property's
// rent and optional applicant income (used to pre-compute the income multiple).
const baseInput = {
  applicantName: z.string().trim().min(2, "Applicant name is required"),
  propertyId: z.string().uuid().optional(),
  /** When re-analysing, append a new assessment to this application. */
  existingApplicationId: z.string().uuid().optional(),
  /** When screening from an applicant-submitted intake form, mark it screened. */
  intakeLinkId: z.string().uuid().optional(),
  rentAmount: z.coerce
    .number()
    .positive("Set the property's monthly rent before screening"),
  /** Net monthly income entered in property context (optional). */
  applicantMonthlyIncome: z.coerce.number().nonnegative().optional(),
  /** Affordability threshold for the LLM; fixed at 2.5× UK standard. */
  requiredIncomeMultiple: z.coerce.number().positive().default(2.5),
};

const pasteInput = z.object({
  inputMode: z.literal("paste"),
  ...baseInput,
  rawText: z
    .string()
    .trim()
    .min(20, "Paste the applicant's details (at least a sentence)")
    .max(20_000, "Applicant details are too long (max 20,000 characters)"),
});

// Structured form. Everything except the name is optional; age is intentionally
// excluded to reduce discrimination risk (see Product Designer notes).
const formInput = z.object({
  inputMode: z.literal("form"),
  ...baseInput,
  householdSize: z.coerce.number().int().min(1).optional(),
  employmentStatus: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  employer: z.string().trim().optional(),
  monthlyIncome: z.coerce.number().nonnegative().optional(),
  monthsInJob: z.coerce.number().int().nonnegative().optional(),
  declaredDebts: z.coerce.number().nonnegative().optional(),
  adverseCredit: z.string().trim().optional(),
  currentAddress: z.string().trim().optional(),
  monthsAtCurrentAddress: z.coerce.number().int().nonnegative().optional(),
  previousLandlordReference: z.string().trim().optional(),
});

export const screeningInputSchema = z.discriminatedUnion("inputMode", [
  pasteInput,
  formInput,
]);

// Applicant-facing intake submission (public /apply/[token] form).
// Mirrors the structured form minus rent/property context, which stays with
// the landlord. Length caps guard the unauthenticated endpoint.
export const intakeSubmissionSchema = z.object({
  applicantName: z
    .string()
    .trim()
    .min(2, "Your full name is required")
    .max(120, "Name is too long"),
  monthlyIncome: z.coerce.number().nonnegative().optional(),
  employmentStatus: z.string().trim().max(120).optional(),
  jobTitle: z.string().trim().max(120).optional(),
  employer: z.string().trim().max(160).optional(),
  monthsInJob: z.coerce.number().int().nonnegative().max(1200).optional(),
  householdSize: z.coerce.number().int().min(1).max(20).optional(),
  declaredDebts: z.coerce.number().nonnegative().optional(),
  adverseCredit: z.string().trim().max(1000).optional(),
  currentAddress: z.string().trim().max(300).optional(),
  monthsAtCurrentAddress: z.coerce.number().int().nonnegative().max(1200).optional(),
  previousLandlordReference: z.string().trim().max(2000).optional(),
});

// Strict JSON contract the LLM must return. snake_case mirrors both the model
// output and the assessments table columns.
export const assessmentOutputSchema = z.object({
  risk_score: z.number().int().min(0).max(100),
  risk_level: z.enum(RISK_LEVELS),
  recommendation: z.enum(RECOMMENDATIONS),
  summary: z.string().trim().min(1),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  conditions: z.array(z.string()),
  suggested_questions: z.array(z.string()),
  data_gaps: z.array(z.string()),
});

export type ScreeningInput = z.infer<typeof screeningInputSchema>;
export type IntakeSubmission = z.infer<typeof intakeSubmissionSchema>;
export type AssessmentOutput = z.infer<typeof assessmentOutputSchema>;
export type RiskLevel = (typeof RISK_LEVELS)[number];
export type Recommendation = (typeof RECOMMENDATIONS)[number];
