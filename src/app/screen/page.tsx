import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { ScreeningWorkspace } from "@/components/screening/screening-workspace";
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

      <main className="mx-auto max-w-[var(--container-wide)] space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Screen an applicant</h1>
          <p className="text-sm text-text-muted">
            Paste an application or fill the form, then analyse for a risk score
            and recommendation.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-xs text-text-muted">
          <span className="font-medium text-text">
            AI-generated screening aid.
          </span>{" "}
          Not a credit check, referencing report, or legal advice. Verify
          documents independently and comply with the Equality Act 2010.
        </div>

        <ScreeningWorkspace />
      </main>
    </div>
  );
}
