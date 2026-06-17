import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { ScreeningWorkspace } from "@/components/screening/screening-workspace";
import { PageHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { getCreditBalance } from "@/lib/screening/credits";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Screen an applicant",
};

export default async function ScreenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/screen");

  const balance = await getCreditBalance(createAdminClient(), user.id);

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader creditBalance={balance} width="wide" />

      <main id="main-content" className="mx-auto max-w-[var(--container-wide)] space-y-6 px-4 py-8">
        <PageHeader
          title="Screen an applicant"
          description="Paste an application or fill the form, then analyse for a risk score and recommendation."
        />

        {balance === 0 && (
          <Alert variant="warning" title="No credits remaining">
            Buy credits or upgrade to Pro to run a new screening.
          </Alert>
        )}

        <Alert variant="info">
          <span className="font-medium text-text">AI-generated screening aid.</span>{" "}
          Not a credit check, referencing report, or legal advice. Verify
          documents independently and comply with the Equality Act 2010.
        </Alert>

        <ScreeningWorkspace />
      </main>
    </div>
  );
}
