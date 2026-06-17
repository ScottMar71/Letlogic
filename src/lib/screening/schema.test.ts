import { describe, expect, it } from "vitest";
import { assessmentOutputSchema, screeningInputSchema } from "./schema";

describe("screeningInputSchema — paste mode", () => {
  it("accepts valid paste input and applies the default income multiple", () => {
    const result = screeningInputSchema.safeParse({
      inputMode: "paste",
      applicantName: "Jane Doe",
      rentAmount: 1200,
      rawText: "Jane works full time, earns £3,600/month, 4 years in role.",
    });
    expect(result.success).toBe(true);
    if (result.success && result.data.inputMode === "paste") {
      expect(result.data.requiredIncomeMultiple).toBe(2.5);
    }
  });

  it("rejects paste text that is too short", () => {
    const result = screeningInputSchema.safeParse({
      inputMode: "paste",
      applicantName: "Jane Doe",
      rentAmount: 1200,
      rawText: "too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects paste text that exceeds the max length", () => {
    const result = screeningInputSchema.safeParse({
      inputMode: "paste",
      applicantName: "Jane Doe",
      rentAmount: 1200,
      rawText: "x".repeat(20_001),
    });
    expect(result.success).toBe(false);
  });
});

describe("screeningInputSchema — form mode", () => {
  it("accepts a minimal form (name + rent only)", () => {
    const result = screeningInputSchema.safeParse({
      inputMode: "form",
      applicantName: "Sam Lee",
      rentAmount: 950,
    });
    expect(result.success).toBe(true);
  });

  it("coerces numeric strings from form fields", () => {
    const result = screeningInputSchema.safeParse({
      inputMode: "form",
      applicantName: "Sam Lee",
      rentAmount: "950",
      monthlyIncome: "2800",
      monthsInJob: "18",
    });
    expect(result.success).toBe(true);
    if (result.success && result.data.inputMode === "form") {
      expect(result.data.monthlyIncome).toBe(2800);
      expect(result.data.monthsInJob).toBe(18);
    }
  });
});

describe("screeningInputSchema — shared validation", () => {
  it("rejects a missing applicant name", () => {
    const result = screeningInputSchema.safeParse({
      inputMode: "form",
      applicantName: "",
      rentAmount: 950,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero or negative rent", () => {
    const result = screeningInputSchema.safeParse({
      inputMode: "form",
      applicantName: "Sam Lee",
      rentAmount: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("assessmentOutputSchema", () => {
  const valid = {
    risk_score: 72,
    risk_level: "high",
    recommendation: "proceed_with_conditions",
    summary: "Income covers rent but employment is recent.",
    pros: ["Income multiple 3.0x"],
    cons: ["Only 5 months in current role"],
    conditions: ["Request a guarantor"],
    suggested_questions: ["Confirm probation status"],
    data_gaps: ["No rental history provided"],
  };

  it("accepts a well-formed assessment", () => {
    expect(assessmentOutputSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an out-of-range risk score", () => {
    expect(
      assessmentOutputSchema.safeParse({ ...valid, risk_score: 140 }).success,
    ).toBe(false);
  });

  it("rejects an unknown recommendation value", () => {
    expect(
      assessmentOutputSchema.safeParse({ ...valid, recommendation: "reject" })
        .success,
    ).toBe(false);
  });
});
