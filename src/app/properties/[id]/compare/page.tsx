import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { BestFit } from "@/components/screening/best-fit";
import { CompareCards } from "@/components/properties/compare-cards";
import { CompareTable } from "@/components/properties/compare-table";
import { PageHeader } from "@/components/ui/page-header";
import { getPropertyForUser, listAssessmentsForProperty } from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function ComparePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/properties/${id}/compare`);

  const admin = createAdminClient();
  const property = await getPropertyForUser(admin, user.id, id);
  if (!property) notFound();

  const applicants = await listAssessmentsForProperty(admin, user.id, id);
  if (applicants.length < 2) notFound();

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="wide" />

      <main id="main-content" className="mx-auto max-w-[var(--container-wide)] space-y-6 px-4 py-8">
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
      </main>
    </div>
  );
}
