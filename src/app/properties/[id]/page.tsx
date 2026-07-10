import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { ScreeningWorkspace } from "@/components/screening/screening-workspace";
import { RiskChip } from "@/components/screening/risk-chip";
import { PageHeader } from "@/components/ui/page-header";
import { withHomeBreadcrumb } from "@/lib/navigation/breadcrumbs";
import { StatusBadge } from "@/components/ui/status-badge";
import { listAssessmentsForProperty } from "@/lib/screening/queries";
import { isPro } from "@/lib/screening/entitlements";
import { getAuthenticatedUser } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Property");

type PageProps = { params: Promise<{ id: string }> };

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
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
  const pro = await isPro(admin, user.id);
  const canCompare = applicants.length >= 2;

  return (
    <AuthenticatedPage width="content">
      <PageHeader
          title={property.address_line1}
          description={`${property.city}, ${property.postcode}${property.rent_amount ? ` · £${property.rent_amount}/mo` : ""}`}
          breadcrumbs={withHomeBreadcrumb([
            { label: "Properties", href: "/properties" },
            { label: property.address_line1 },
          ])}
          actions={
            canCompare ? (
              pro ? (
                <Link
                  href={`/properties/${id}/compare`}
                  className="btn-secondary"
                >
                  Compare applicants ({applicants.length})
                </Link>
              ) : (
                <Link
                  href={`/properties/${id}/compare`}
                  className="btn-secondary"
                >
                  Compare applicants (Pro)
                </Link>
              )
            ) : (
              <span className="flex items-center gap-2 text-sm text-text-subtle">
                <StatusBadge variant="neutral">Compare</StatusBadge>
                Screen another applicant to compare
              </span>
            )
          }
        />

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
    </AuthenticatedPage>
  );
}
