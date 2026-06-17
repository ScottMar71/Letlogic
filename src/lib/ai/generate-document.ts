import OpenAI from "openai";
import { z } from "zod";
import type { GeneratedDocument } from "@/lib/documents/types";

const outputSchema = z.object({
  title: z.string(),
  sections: z.array(
    z.object({
      heading: z.string().optional(),
      paragraphs: z.array(z.string()),
    }),
  ),
  disclaimer: z.string(),
  generatedAt: z.string(),
});

export async function generateDocument(
  systemPrompt: string,
): Promise<GeneratedDocument> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You generate UK landlord compliance document drafts. Output valid JSON only. Never invent facts not provided in the user message.",
      },
      { role: "user", content: systemPrompt },
    ],
    temperature: 0.2,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");

  const parsed = outputSchema.parse(JSON.parse(raw));
  return {
    ...parsed,
    generatedAt: new Date().toISOString(),
  };
}
