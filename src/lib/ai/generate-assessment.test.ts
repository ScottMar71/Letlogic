import { beforeEach, describe, expect, it, vi } from "vitest";

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

vi.mock("openai", () => ({
  default: class {
    chat = { completions: { create: createMock } };
  },
}));

import { generateAssessment } from "./generate-assessment";

const validOutput = {
  risk_score: 30,
  risk_level: "low",
  recommendation: "proceed",
  summary: "Income comfortably covers rent.",
  pros: ["Income multiple 3.0x"],
  cons: [],
  conditions: [],
  suggested_questions: ["Confirm proof of income"],
  data_gaps: [],
};

function aiResponse(content: string) {
  return { choices: [{ message: { content } }] };
}

describe("generateAssessment", () => {
  beforeEach(() => createMock.mockReset());

  it("returns a validated assessment on well-formed JSON", async () => {
    createMock.mockResolvedValueOnce(aiResponse(JSON.stringify(validOutput)));
    const result = await generateAssessment("prompt");
    expect(result.output.risk_score).toBe(30);
    expect(result.model).toBe("gpt-4o");
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("retries once when the first response is malformed", async () => {
    createMock
      .mockResolvedValueOnce(aiResponse("not json"))
      .mockResolvedValueOnce(aiResponse(JSON.stringify(validOutput)));
    const result = await generateAssessment("prompt");
    expect(result.output.recommendation).toBe("proceed");
    expect(createMock).toHaveBeenCalledTimes(2);
  });

  it("throws after two malformed responses", async () => {
    createMock
      .mockResolvedValueOnce(aiResponse("not json"))
      .mockResolvedValueOnce(aiResponse(JSON.stringify({ risk_score: 999 })));
    await expect(generateAssessment("prompt")).rejects.toThrow(
      /Assessment generation failed/,
    );
    expect(createMock).toHaveBeenCalledTimes(2);
  });
});
