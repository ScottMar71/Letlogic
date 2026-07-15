import Link from "next/link";
import { ApplicantIntakeForm } from "@/components/intake/applicant-intake-form";
import { getIntakeLinkByToken } from "@/lib/screening/intake";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata = privatePageMetadata("Tenant application form");

type PageProps = { params: Promise<{ token: string }> };

const TOKEN_PATTERN = /^[a-f0-9]{32}$/;

export default async function ApplyPage({ params }: PageProps) {
  const { token } = await params;

  const link = TOKEN_PATTERN.test(token)
    ? await getIntakeLinkByToken(createAdminClient(), token)
    : null;

  const landlordLabel = link?.landlordName ?? "your landlord";

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-xl flex-1 space-y-6 px-4 py-10"
    >
      <header>
        <p className="text-lg font-bold text-text">{site.name}</p>
        <p className="text-sm text-text-muted">Tenant application form</p>
      </header>

      {!link || link.status === "cancelled" ? (
        <StatusCard
          title="This link isn't valid"
          body="The application link may have been cancelled or mistyped. Please check the link or contact the landlord who sent it to you."
        />
      ) : link.expired ? (
        <StatusCard
          title="This link has expired"
          body={`Application links are valid for 14 days. Please ask ${landlordLabel} to send you a new one.`}
        />
      ) : link.status !== "pending" ? (
        <StatusCard
          title="Application received"
          body={`Your application has already been submitted and shared with ${landlordLabel}. There's nothing more you need to do.`}
        />
      ) : (
        <>
          <div className="rounded-xl border border-info-border bg-info-bg p-4 text-sm text-text-muted">
            <p>
              <span className="font-medium text-text">{landlordLabel}</span> has
              asked you to fill in this short form
              {link.propertyLabel ? (
                <>
                  {" "}
                  for <span className="font-medium text-text">{link.propertyLabel}</span>
                </>
              ) : null}
              . Your answers go directly to them to help assess your application —
              this is not a credit check.
            </p>
          </div>

          <ApplicantIntakeForm token={token} landlordLabel={landlordLabel} />
        </>
      )}

      <footer className="border-t border-border pt-4 text-xs text-text-subtle">
        <p>
          Powered by{" "}
          <Link href="/" className="font-medium text-brand-ink underline">
            {site.name}
          </Link>{" "}
          — AI-assisted tenant screening for UK landlords. Your answers are
          shared only with the landlord who sent you this link.
        </p>
      </footer>
    </main>
  );
}

function StatusCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h1 className="text-lg font-semibold text-text">{title}</h1>
      <p className="mt-2 text-sm text-text-muted">{body}</p>
    </div>
  );
}
