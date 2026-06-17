import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { ScreeningWorkspace } from "@/components/screening/screening-workspace";
import { RiskChip } from "@/components/screening/risk-chip";
import { listAssessmentsForProperty } from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/properties/${id}`);

  const admin = createAdminClient();
  const { data: property } = await admin
    .from("properties")
    .select("id, address_line1, city, postcode, rent_amount")
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!property) notFound();

  const applicants = await listAssessmentsForProperty(admin, user.id, id);
  const canCompare = applicants.length >= 2;

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="content" />

      <main className="mx-auto max-w-[var(--container-content)] space-y-8 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text">
              {property.address_line1}
            </h1>
            <p className="text-sm text-text-subtle">
              {property.city}, {property.postcode}
              {property.rent_amount ? ` · £${property.rent_amount}/mo` : ""}
            </p>
          </div>
          {canCompare && (
            <Link
              href={`/properties/${id}/compare`}
              className="btn-secondary"
            >
              Compare applicants ({applicants.length})
            </Link>
          )}
        </div>

        {applicants.length > 0 && (
          <section className="space-y-3">
            <h2 className="section-label">Applicants</h2>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {applicants.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/screenings/${a.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-muted"
                  >
                    <span className="min-w-0 truncate font-medium text-text">
                      {a.applicantName}
                    </span>
                    <RiskChip level={a.riskLevel} score={a.riskScore} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="section-label">Screen a new applicant</h2>
          <ScreeningWorkspace
            propertyId={property.id}
            defaultRent={property.rent_amount ?? undefined}
          />
        </section>
      </main>
    </div>
  );
}
