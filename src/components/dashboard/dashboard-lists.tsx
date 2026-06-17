"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { RiskChip } from "@/components/screening/risk-chip";
import type { AssessmentSummary, PropertyRow } from "@/lib/screening/queries";

type DashboardListsProps = {
  screenings: AssessmentSummary[];
  properties: PropertyRow[];
};

export function DashboardLists({ screenings, properties }: DashboardListsProps) {
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
    <>
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-label">Recent screenings</h2>
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
          <p className="text-sm text-text-subtle">No screenings match your filters.</p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {filteredScreenings.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/screenings/${a.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">
                      {a.applicantName}
                    </p>
                    <p className="text-xs text-text-subtle">
                      {a.incomeMultiple != null
                        ? `${a.incomeMultiple}x income · `
                        : ""}
                      {new Date(a.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <RiskChip level={a.riskLevel} score={a.riskScore} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-label">Properties</h2>
          <div className="flex items-center gap-2">
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
            <Link
              href="/properties/new"
              className="text-sm font-medium text-brand-600 underline hover:text-brand-500"
            >
              Add property
            </Link>
          </div>
        </div>
        {properties.length === 0 ? (
          <EmptyState
            title="No properties yet"
            description="Add a property to track screenings by address and compare applicants."
            actionLabel="Add property"
            actionHref="/properties/new"
          />
        ) : filteredProperties.length === 0 ? (
          <p className="text-sm text-text-subtle">No properties match your search.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {filteredProperties.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/properties/${p.id}`}
                  className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand-600"
                >
                  <p className="font-medium text-text">{p.addressLine1}</p>
                  <p className="text-sm text-text-subtle">
                    {p.city}, {p.postcode}
                    {p.rentAmount ? ` · £${p.rentAmount}/mo` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
