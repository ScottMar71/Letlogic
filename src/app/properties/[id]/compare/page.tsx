import { notFound, redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { BestFit } from "@/components/screening/best-fit";
import { CompareCards } from "@/components/properties/compare-cards";
import { CompareTable } from "@/components/properties/compare-table";
import { PageHeader } from "@/components/ui/page-header";
import { getPropertyForUser, listAssessmentsForProperty } from "@/lib/screening/queries";
import { isPro } from "@/lib/screening/entitlements";
import { ProCompareGatePage } from "@/components/screening/pro-compare-gate-page";
import { getAuthenticatedUser } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Compare applicants");

type PageProps = { params: Promise<{ id: string }> };

export default async function ComparePage({ params }: PageProps) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=/properties/${id}/compare`);

  const admin = createAdminClient();
  const property = await getPropertyForUser(admin, user.id, id);
  if (!property) notFound();

  const applicants = await listAssessmentsForProperty(admin, user.id, id);
  if (applicants.length < 2) notFound();

  const pro = await isPro(admin, user.id);
  if (!pro) {
    return (
      <ProCompareGatePage
        propertyId={id}
        propertyName={property.addressLine1}
        applicantCount={applicants.length}
      />
    );
  }

  return (
    <AuthenticatedPage width="wide" mainClassName="space-y-6">
      <PageHeader
        title="Compare applicants"
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: property.addressLine1, href: `/properties/${id}` },
          { label: "Compare" },
        ]}
      />

      <BestFit propertyId={id} />

      <CompareCards applicants={applicants} />
      <CompareTable applicants={applicants} />
    </AuthenticatedPage>
  );
}
