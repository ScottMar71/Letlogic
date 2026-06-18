const MAX_BYTES = 5 * 1024 * 1024;

/** Extract plain text from a PDF file in the browser. Not stored server-side. */
export async function extractTextFromPdf(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error("PDF must be 5 MB or smaller.");
  }
  if (file.type !== "application/pdf") {
    throw new Error("Please upload a PDF file.");
  }

  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const chunks: string[] = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .trim();
    if (pageText) chunks.push(pageText);
  }

  const text = chunks.join("\n\n").trim();
  if (!text) {
    throw new Error(
      "No readable text found. Try a text-based PDF or paste the application manually.",
    );
  }
  return text;
}

export const PDF_UPLOAD_MAX_MB = MAX_BYTES / (1024 * 1024);
