import { NextResponse } from "next/server";
import {
  extractTextFromPdfBuffer,
  PDF_MAX_BYTES,
} from "@/lib/pdf/extract-from-buffer";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in to upload a PDF." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
  }

  if (file.size > PDF_MAX_BYTES) {
    return NextResponse.json(
      { error: "PDF must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  try {
    const data = new Uint8Array(await file.arrayBuffer());
    const text = await extractTextFromPdfBuffer(data);
    return NextResponse.json({ text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not read PDF";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
