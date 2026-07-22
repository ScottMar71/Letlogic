"use client";

import { DashboardPropertiesList } from "@/components/dashboard/dashboard-properties-list";
import { DashboardScreeningsList } from "@/components/dashboard/dashboard-screenings-list";
import type {
  AssessmentSummary,
  PropertyRow,
  PropertyScreeningActivity,
} from "@/lib/screening/queries";

type DashboardListsProps = {
  screenings: AssessmentSummary[];
  properties: PropertyRow[];
  propertyActivity: Record<string, PropertyScreeningActivity>;
  propertyLabels: Record<string, string>;
  initialRiskFilter?: string;
  initialRecommendationFilter?: string;
};

export function DashboardLists({
  screenings,
  properties,
  propertyActivity,
  propertyLabels,
  initialRiskFilter = "all",
  initialRecommendationFilter = "all",
}: DashboardListsProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <DashboardScreeningsList
        screenings={screenings}
        propertyLabels={propertyLabels}
        initialRiskFilter={initialRiskFilter}
        initialRecommendationFilter={initialRecommendationFilter}
      />
      <DashboardPropertiesList
        properties={properties}
        propertyActivity={propertyActivity}
      />
    </div>
  );
}
