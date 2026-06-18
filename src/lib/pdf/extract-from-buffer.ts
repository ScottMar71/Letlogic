const MAX_BYTES = 5 * 1024 * 1024;

export const PDF_MAX_BYTES = MAX_BYTES;

export function validatePdfBytes(data: Uint8Array, fileName?: string): void {
  if (data.byteLength > MAX_BYTES) {
    throw new Error("PDF must be 5 MB or smaller.");
  }
  if (fileName && !fileName.toLowerCase().endsWith(".pdf")) {
    throw new Error("Please upload a PDF file.");
  }
}

/** Extract plain text from PDF bytes (Node/server). The buffer is not persisted. */
export async function extractTextFromPdfBuffer(data: Uint8Array): Promise<string> {
  validatePdfBytes(data);

  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(data);
  const { text } = await extractText(pdf, { mergePages: true });

  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error(
      "No readable text found. Try a text-based PDF or paste the application manually.",
    );
  }
  return trimmed;
}
