import OpenAI from "openai";
import {
  assessmentOutputSchema,
  type AssessmentOutput,
} from "@/lib/screening/schema";

const ASSESSMENT_MODEL = "gpt-4o";

const SYSTEM = "You assess UK tenant applications for landlords. Output valid JSON only, matching the requested schema. Never use protected characteristics. Never invent facts.";

export type AssessmentResult = {
  output: AssessmentOutput;
  model: string;
};

/**
 * Calls the LLM with the prepared screening prompt and returns a validated
 * assessment. Retries once on malformed JSON before throwing, so the caller
 * (the analyse action) can refund the spent credit on failure.
 */
export async function generateAssessment(
  prompt: string,
): Promise<AssessmentResult> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await openai.chat.completions.create({
      model: ASSESSMENT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      lastError = new Error("Empty response from AI");
      continue;
    }

    try {
      const output = assessmentOutputSchema.parse(JSON.parse(raw));
      return { output, model: ASSESSMENT_MODEL };
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `Assessment generation failed: ${
      lastError instanceof Error ? lastError.message : "invalid output"
    }`,
  );
}
