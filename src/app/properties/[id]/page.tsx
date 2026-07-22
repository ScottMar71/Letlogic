import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { RiskChip } from "@/components/screening/risk-chip";
import { PageHeader } from "@/components/ui/page-header";
import { withHomeBreadcrumb } from "@/lib/navigation/breadcrumbs";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCreditBalance } from "@/lib/screening/credits";
import {
  getPropertyForUser,
  listAssessmentsForProperty,
} from "@/lib/screening/queries";
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
  const [property, balance] = await Promise.all([
    getPropertyForUser(admin, user.id, id),
    getCreditBalance(admin, user.id),
  ]);

  if (!property) notFound();

  const applicants = await listAssessmentsForProperty(admin, user.id, id);
  const pro = await isPro(admin, user.id);
  const canCompare = applicants.length >= 2;
  const screenHref = `/screen?property=${encodeURIComponent(id)}`;

  return (
    <AuthenticatedPage creditBalance={balance} width="content">
      <PageHeader
        title={property.addressLine1}
        description={`${property.city}, ${property.postcode}${property.rentAmount ? ` · £${property.rentAmount}/mo` : ""}`}
        breadcrumbs={withHomeBreadcrumb([
          { label: "Properties", href: "/properties" },
          { label: property.addressLine1 },
        ])}
        actions={
          <div className="flex flex-wrap gap-2">
            {canCompare ? (
              <Link
                href={`/properties/${id}/compare`}
                className="btn-secondary"
              >
                {pro
                  ? `Compare applicants (${applicants.length})`
                  : "Compare applicants (Pro)"}
              </Link>
            ) : applicants.length > 0 ? (
              <span className="flex items-center gap-2 text-sm text-text-subtle">
                <StatusBadge variant="neutral">Compare</StatusBadge>
                Screen another to compare
              </span>
            ) : null}
            <Link href={screenHref} className="btn-primary">
              Screen applicant
            </Link>
          </div>
        }
      />

      {applicants.length > 0 ? (
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
      ) : (
        <section className="rounded-xl border border-dashed border-border-strong bg-surface p-8 text-center">
          <p className="font-medium text-text">No applicants yet</p>
          <p className="mt-1 text-sm text-text-subtle">
            Screen someone for this property to see them listed here.
          </p>
          <Link href={screenHref} className="btn-primary mt-4 inline-flex">
            Screen applicant
          </Link>
        </section>
      )}
    </AuthenticatedPage>
  );
}
