import { describe, expect, it } from "vitest";
import { computeMetrics } from "./metrics";

describe("computeMetrics — income multiple", () => {
  it("computes a straightforward multiple", () => {
    expect(
      computeMetrics({ monthlyIncome: 3000, rentAmount: 1000 }).incomeMultiple,
    ).toBe(3);
  });

  it("rounds to two decimal places", () => {
    expect(
      computeMetrics({ monthlyIncome: 3200, rentAmount: 1000 }).incomeMultiple,
    ).toBe(3.2);
    expect(
      computeMetrics({ monthlyIncome: 1000, rentAmount: 3000 }).incomeMultiple,
    ).toBe(0.33);
  });

  it("returns null when rent is zero or negative", () => {
    expect(
      computeMetrics({ monthlyIncome: 3000, rentAmount: 0 }).incomeMultiple,
    ).toBeNull();
    expect(
      computeMetrics({ monthlyIncome: 3000, rentAmount: -500 }).incomeMultiple,
    ).toBeNull();
  });

  it("returns null when income is missing, null, or negative", () => {
    expect(computeMetrics({ rentAmount: 1000 }).incomeMultiple).toBeNull();
    expect(
      computeMetrics({ monthlyIncome: null, rentAmount: 1000 }).incomeMultiple,
    ).toBeNull();
    expect(
      computeMetrics({ monthlyIncome: -100, rentAmount: 1000 }).incomeMultiple,
    ).toBeNull();
  });

  it("returns null for non-finite values", () => {
    expect(
      computeMetrics({ monthlyIncome: Number.NaN, rentAmount: 1000 })
        .incomeMultiple,
    ).toBeNull();
  });
});

describe("computeMetrics — stability scores", () => {
  it("returns null when months are unknown", () => {
    const m = computeMetrics({});
    expect(m.jobStabilityScore).toBeNull();
    expect(m.tenancyStabilityScore).toBeNull();
  });

  it("maps zero months to a score of 0", () => {
    expect(computeMetrics({ monthsInJob: 0 }).jobStabilityScore).toBe(0);
  });

  it("scales 6 months per point", () => {
    expect(computeMetrics({ monthsInJob: 12 }).jobStabilityScore).toBe(2);
    expect(computeMetrics({ monthsInJob: 36 }).jobStabilityScore).toBe(6);
  });

  it("caps at 10 for long tenure", () => {
    expect(computeMetrics({ monthsInJob: 60 }).jobStabilityScore).toBe(10);
    expect(computeMetrics({ monthsInJob: 240 }).jobStabilityScore).toBe(10);
  });

  it("clamps negative months to 0", () => {
    expect(
      computeMetrics({ monthsAtAddresses: -12 }).tenancyStabilityScore,
    ).toBe(0);
  });

  it("treats non-finite months as unknown", () => {
    expect(
      computeMetrics({ monthsAtAddresses: Number.POSITIVE_INFINITY })
        .tenancyStabilityScore,
    ).toBeNull();
  });
});

describe("computeMetrics — integration", () => {
  it("computes all three metrics together", () => {
    expect(
      computeMetrics({
        monthlyIncome: 2500,
        rentAmount: 1000,
        monthsInJob: 48,
        monthsAtAddresses: 18,
      }),
    ).toEqual({
      incomeMultiple: 2.5,
      jobStabilityScore: 8,
      tenancyStabilityScore: 3,
    });
  });
});
