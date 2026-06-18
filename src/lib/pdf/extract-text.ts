import { extractTextFromPdfBuffer, PDF_MAX_BYTES } from "@/lib/pdf/extract-from-buffer";
import { isSafari } from "@/lib/pdf/is-safari";

function isPdfFile(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

async function extractViaServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/pdf/extract-text", { method: "POST", body: form });
  const body = (await res.json()) as { text?: string; error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? "Could not read PDF");
  }
  if (!body.text?.trim()) {
    throw new Error("No readable text found in this PDF.");
  }
  return body.text;
}

async function extractInBrowser(file: File): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer());
  return extractTextFromPdfBuffer(data);
}

/** Extract plain text from a PDF file. Safari uses a one-off server request; not stored. */
export async function extractTextFromPdf(file: File): Promise<string> {
  if (file.size > PDF_MAX_BYTES) {
    throw new Error("PDF must be 5 MB or smaller.");
  }
  if (!isPdfFile(file)) {
    throw new Error("Please upload a PDF file.");
  }

  if (isSafari()) {
    return extractViaServer(file);
  }

  try {
    return await extractInBrowser(file);
  } catch {
    // Non-Safari fallback if client-side PDF.js fails (e.g. bundler quirks).
    return extractViaServer(file);
  }
}

export const PDF_UPLOAD_MAX_MB = PDF_MAX_BYTES / (1024 * 1024);

export { isSafari } from "@/lib/pdf/is-safari";
