import type { GeneratedDocument } from "@/lib/documents/types";

export function renderDocumentHtml(
  doc: GeneratedDocument,
  options: { watermark?: boolean } = {},
): string {
  const watermark = options.watermark ?? false;

  const sections = doc.sections
    .map((section) => {
      const heading = section.heading
        ? `<h2 class="doc-heading">${escapeHtml(section.heading)}</h2>`
        : "";
      const paragraphs = section.paragraphs
        .map((p) => `<p class="doc-para">${escapeHtml(p)}</p>`)
        .join("");
      return `${heading}${paragraphs}`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(doc.title)}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 700px; margin: 40px auto; padding: 24px; color: #111; line-height: 1.6; }
    h1 { font-size: 1.4rem; margin-bottom: 1.5rem; }
    .doc-heading { font-size: 1.05rem; margin-top: 1.25rem; margin-bottom: 0.5rem; }
    .doc-para { margin: 0 0 0.85rem; }
    .disclaimer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.85rem; color: #555; }
    .watermark-wrap { position: relative; }
    .watermark-wrap::after {
      content: 'PREVIEW — LETLOGIC';
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; font-weight: bold; color: rgba(0,0,0,0.08);
      transform: rotate(-30deg); pointer-events: none; user-select: none;
    }
  </style>
</head>
<body>
  <div class="${watermark ? "watermark-wrap" : ""}">
    <h1>${escapeHtml(doc.title)}</h1>
    ${sections}
    <div class="disclaimer">${escapeHtml(doc.disclaimer)}</div>
    <p class="disclaimer">Generated: ${escapeHtml(new Date(doc.generatedAt).toLocaleDateString("en-GB"))}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
