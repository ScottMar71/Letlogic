import { describe, expect, it } from "vitest";
import { buildScreeningPrompt } from "./prompt";
import type { ScreeningInput } from "./schema";

const baseInput: ScreeningInput = {
  inputMode: "paste",
  applicantName: "Jane Doe",
  rentAmount: 1200,
  requiredIncomeMultiple: 2.5,
  rawText: "Jane earns £3,600/month, 4 years in role, no debts.",
};

describe("buildScreeningPrompt", () => {
  it("embeds the pre-computed metrics", () => {
    const prompt = buildScreeningPrompt(baseInput, {
      incomeMultiple: 3,
      jobStabilityScore: 8,
      tenancyStabilityScore: 4,
    });
    expect(prompt).toContain("Income multiple");
    expect(prompt).toContain("3x");
    expect(prompt).toContain("Job stability score (0-10): 8");
  });

  it("includes anti-discrimination and no-legal-advice guardrails", () => {
    const prompt = buildScreeningPrompt(baseInput, {
      incomeMultiple: 3,
      jobStabilityScore: 8,
      tenancyStabilityScore: 4,
    });
    expect(prompt).toContain("protected characteristics");
    expect(prompt).toMatch(/do NOT give legal advice/i);
    expect(prompt).toMatch(/do NOT invent facts/i);
  });

  it("marks unknown metrics rather than inventing them", () => {
    const prompt = buildScreeningPrompt(baseInput, {
      incomeMultiple: null,
      jobStabilityScore: null,
      tenancyStabilityScore: null,
    });
    expect(prompt).toContain("not computable");
    expect(prompt).toContain("unknown");
  });

  it("renders structured form fields when provided", () => {
    const prompt = buildScreeningPrompt(
      {
        inputMode: "form",
        applicantName: "Sam Lee",
        rentAmount: 950,
        requiredIncomeMultiple: 3,
        employer: "Acme Ltd",
        monthlyIncome: 2800,
      },
      { incomeMultiple: 2.95, jobStabilityScore: null, tenancyStabilityScore: null },
    );
    expect(prompt).toContain("Employer: Acme Ltd");
    expect(prompt).toContain("Net monthly income (£): 2800");
  });
});
