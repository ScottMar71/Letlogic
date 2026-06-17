import Link from "next/link";
import { redirect } from "next/navigation";
import { getPurchasedDocument } from "@/app/actions/documents";
import { renderDocumentHtml } from "@/lib/documents/render";
import type { GeneratedDocument } from "@/lib/documents/types";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function Section21SuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (!sessionId) {
    return (
      <Message
        title="Payment processing"
        body="If you just paid, your document will be ready shortly. Refresh this page in a few seconds."
      />
    );
  }

  const document = await getPurchasedDocument(sessionId);

  if (!document) {
    return (
      <Message
        title="Processing your payment"
        body="Stripe is confirming your payment. This page will update automatically — refresh in a moment."
      />
    );
  }

  const content = document.generated_content as GeneratedDocument;
  const html = renderDocumentHtml(content, { watermark: false });

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/" className="font-semibold text-zinc-900">
            LetLogic
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <h1 className="text-xl font-semibold text-green-900">
            Payment successful
          </h1>
          <p className="text-green-800 mt-1">
            Your Section 21 notice is ready to download or print.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
          <iframe
            title="Your document"
            srcDoc={html}
            className="w-full min-h-[600px] border-0"
            sandbox=""
          />
        </div>
        <p className="text-sm text-zinc-500">
          You can re-edit this document for 30 days from your account (coming
          soon). Save this page or print to PDF from your browser.
        </p>
      </main>
    </div>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center space-y-3">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-zinc-600 text-sm">{body}</p>
        <Link
          href="/documents/section-21"
          className="inline-block text-sm underline text-zinc-800"
        >
          Back to Section 21
        </Link>
      </div>
    </div>
  );
}
