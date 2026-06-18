import { AppHeader } from "@/components/layout/app-header";
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
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="wide" />
      <main
        id="main-content"
        className="mx-auto max-w-[var(--container-content)] space-y-6 px-4 py-8"
      >
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
      </main>
    </div>
  );
}
