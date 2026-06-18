"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { extractTextFromPdf, PDF_UPLOAD_MAX_MB } from "@/lib/pdf/extract-text";

type PdfUploadButtonProps = {
  onExtracted: (text: string) => void;
  disabled?: boolean;
};

export function PdfUploadButton({ onExtracted, disabled }: PdfUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const text = await extractTextFromPdf(file);
      onExtracted(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={onFileChange}
        disabled={disabled || loading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || loading}
        className="btn-secondary w-full text-sm"
      >
        <Upload className="h-4 w-4" aria-hidden />
        {loading ? "Reading PDF…" : "Upload PDF application"}
      </button>
      <p className="text-xs text-text-subtle">
        Text is extracted in your browser only (max {PDF_UPLOAD_MAX_MB} MB). Nothing
        is uploaded to our servers until you analyse.
      </p>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
