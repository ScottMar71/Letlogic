"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, ChevronRight, MapPin, Plus, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { RiskChip } from "@/components/screening/risk-chip";
import { formatRelativeTime } from "@/lib/format-relative-time";
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
};

function applicantInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function propertyActivityLabel(activity: PropertyScreeningActivity | undefined): string {
  if (!activity) return "No screenings yet";
  const count = `${activity.screeningCount} screening${activity.screeningCount === 1 ? "" : "s"}`;
  return `${count} · Last ${formatRelativeTime(activity.lastScreenedAt)}`;
}

export function DashboardLists({
  screenings,
  properties,
  propertyActivity,
  propertyLabels,
}: DashboardListsProps) {
  const [screeningQuery, setScreeningQuery] = useState("");
  const [propertyQuery, setPropertyQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filteredScreenings = useMemo(() => {
    return screenings.filter((a) => {
      const matchesQuery = a.applicantName
        .toLowerCase()
        .includes(screeningQuery.toLowerCase());
      const matchesRisk =
        riskFilter === "all" || a.riskLevel === riskFilter;
      return matchesQuery && matchesRisk;
    });
  }, [screenings, screeningQuery, riskFilter]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const haystack = `${p.addressLine1} ${p.city} ${p.postcode}`.toLowerCase();
      return haystack.includes(propertyQuery.toLowerCase());
    });
  }, [properties, propertyQuery]);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <section className="space-y-4 lg:col-span-3">
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
            <p className="text-sm text-text-subtle">No screenings match your filters.</p>
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
                    className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-muted"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700"
                      aria-hidden
                    >
                      {applicantInitials(a.applicantName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-text group-hover:text-brand-700">
                        {a.applicantName}
                      </p>
                      <p className="text-xs text-text-subtle">
                        {a.incomeMultiple != null
                          ? `${a.incomeMultiple}x income · `
                          : ""}
                        {formatRelativeTime(a.createdAt)}
                      </p>
                      {propertyLabel ? (
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-text-muted">
                          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                          {propertyLabel}
                        </p>
                      ) : null}
                    </div>
                    <RiskChip level={a.riskLevel} score={a.riskScore} />
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-text-subtle opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4 lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-h3 font-semibold text-text">Properties</h2>
            <p className="mt-0.5 text-sm text-text-muted">
              Organise screenings by address
            </p>
          </div>
          <Link href="/properties/new" className="btn-secondary min-h-9 px-3 py-1.5 text-sm">
            <Plus className="h-4 w-4" aria-hidden />
            Add
          </Link>
        </div>

        {properties.length > 0 && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <input
              type="search"
              placeholder="Search properties…"
              value={propertyQuery}
              onChange={(e) => setPropertyQuery(e.target.value)}
              className="input min-h-9 py-1.5 pl-9"
              aria-label="Search properties"
            />
          </div>
        )}

        {properties.length === 0 ? (
          <EmptyState
            title="No properties yet"
            description="Add a property to track screenings by address and compare applicants."
            actionLabel="Add property"
            actionHref="/properties/new"
          />
        ) : filteredProperties.length === 0 ? (
          <Card padding="sm">
            <p className="text-sm text-text-subtle">No properties match your search.</p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {filteredProperties.map((p) => {
              const activity = propertyActivity[p.id];

              return (
                <li key={p.id}>
                  <Link
                    href={`/properties/${p.id}`}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:border-brand-600 hover:bg-brand-50/30"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted transition-colors group-hover:bg-brand-50 group-hover:text-brand-600"
                      aria-hidden
                    >
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text group-hover:text-brand-700">
                        {p.addressLine1}
                      </p>
                      <p className="text-sm text-text-subtle">
                        {p.city}, {p.postcode}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                        {p.rentAmount ? (
                          <span className="font-medium text-text-muted">
                            £{p.rentAmount.toLocaleString("en-GB")}/mo
                          </span>
                        ) : null}
                        {p.rentAmount ? (
                          <span className="text-text-subtle" aria-hidden>
                            ·
                          </span>
                        ) : null}
                        <span
                          className={
                            activity ? "text-text-muted" : "text-text-subtle italic"
                          }
                        >
                          {propertyActivityLabel(activity)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-text-subtle opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
