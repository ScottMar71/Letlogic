import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { PageHeader } from "@/components/ui/page-header";
import { ProCompareGate } from "@/components/screening/pro-compare-gate";

type ProCompareGatePageProps = {
  propertyId: string;
  propertyName: string;
  applicantCount: number;
};

export function ProCompareGatePage({
  propertyId,
  propertyName,
  applicantCount,
}: ProCompareGatePageProps) {
  return (
    <AuthenticatedPage width="wide" mainClassName="space-y-6">
      <PageHeader
        title="Compare applicants"
        description={`${applicantCount} screenings for ${propertyName}`}
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: propertyName, href: `/properties/${propertyId}` },
          { label: "Compare" },
        ]}
      />
      <ProCompareGate />
    </AuthenticatedPage>
  );
}
