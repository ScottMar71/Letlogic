"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { RecommendationChip } from "@/components/screening/recommendation-chip";
import { RiskChip } from "@/components/screening/risk-chip";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { AssessmentSummary } from "@/lib/screening/queries";

type DashboardScreeningsListProps = {
  screenings: AssessmentSummary[];
  propertyLabels: Record<string, string>;
  initialRiskFilter?: string;
  initialRecommendationFilter?: string;
};

function applicantInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function truncateSummary(text: string, maxLength = 120): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function DashboardScreeningsList({
  screenings,
  propertyLabels,
  initialRiskFilter = "all",
  initialRecommendationFilter = "all",
}: DashboardScreeningsListProps) {
  const [screeningQuery, setScreeningQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState(initialRiskFilter);
  const [recommendationFilter, setRecommendationFilter] = useState(
    initialRecommendationFilter,
  );

  const filteredScreenings = useMemo(() => {
    return screenings.filter((a) => {
      const query = screeningQuery.toLowerCase();
      const matchesQuery =
        a.applicantName.toLowerCase().includes(query) ||
        (a.summary?.toLowerCase().includes(query) ?? false);
      const matchesRisk = riskFilter === "all" || a.riskLevel === riskFilter;
      const matchesRecommendation =
        recommendationFilter === "all" ||
        a.recommendation === recommendationFilter;
      return matchesQuery && matchesRisk && matchesRecommendation;
    });
  }, [screenings, screeningQuery, riskFilter, recommendationFilter]);

  return (
    <section
      id="recent-screenings"
      className="scroll-mt-24 space-y-4 lg:col-span-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-h3 font-semibold text-text">Recent screenings</h2>
          <p className="mt-0.5 text-sm text-text-muted">
            {screenings.length > 0
              ? `Showing ${filteredScreenings.length} of ${screenings.length}`
              : "Your latest applicant assessments"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <input
              type="search"
              placeholder="Search applicants…"
              value={screeningQuery}
              onChange={(e) => setScreeningQuery(e.target.value)}
              className="input min-h-9 py-1.5 pl-9"
              aria-label="Search screenings"
            />
          </div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="input min-h-9 w-auto py-1.5"
            aria-label="Filter by risk level"
          >
            <option value="all">All risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={recommendationFilter}
            onChange={(e) => setRecommendationFilter(e.target.value)}
            className="input min-h-9 w-auto py-1.5"
            aria-label="Filter by recommendation"
          >
            <option value="all">All decisions</option>
            <option value="proceed">Proceed</option>
            <option value="proceed_with_conditions">With conditions</option>
            <option value="do_not_proceed">Do not proceed</option>
          </select>
        </div>
      </div>

      {screenings.length === 0 ? (
        <EmptyState
          title="No screenings yet"
          description="Screen your first applicant or view a sample report to see how it works."
          actionLabel="Screen an applicant"
          actionHref="/screen"
          secondaryLabel="View sample"
          secondaryHref="/sample"
        />
      ) : filteredScreenings.length === 0 ? (
        <Card padding="sm">
          <p className="text-sm text-text-subtle">
            No screenings match your filters.
          </p>
        </Card>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {filteredScreenings.map((a) => {
            const propertyLabel = a.propertyId
              ? propertyLabels[a.propertyId]
              : null;

            return (
              <li key={a.id}>
                <Link
                  href={`/screenings/${a.id}`}
                  className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-muted"
                >
                  <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700"
                    aria-hidden
                  >
                    {applicantInitials(a.applicantName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-text group-hover:text-brand-700">
                        {a.applicantName}
                      </p>
                      <RecommendationChip recommendation={a.recommendation} />
                    </div>
                    <p className="text-xs text-text-subtle">
                      {a.incomeMultiple != null
                        ? `${a.incomeMultiple}x income · `
                        : ""}
                      {formatRelativeTime(a.createdAt)}
                    </p>
                    {a.summary ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                        {truncateSummary(a.summary)}
                      </p>
                    ) : null}
                    {propertyLabel ? (
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-text-muted">
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                        {propertyLabel}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs italic text-text-subtle">
                        Not linked to a property
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <RiskChip level={a.riskLevel} score={a.riskScore} />
                    <ChevronRight
                      className="h-4 w-4 text-text-subtle opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
