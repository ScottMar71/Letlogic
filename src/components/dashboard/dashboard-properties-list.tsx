"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, ChevronRight, GitCompare, Plus, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type {
  PropertyRow,
  PropertyScreeningActivity,
} from "@/lib/screening/queries";

type DashboardPropertiesListProps = {
  properties: PropertyRow[];
  propertyActivity: Record<string, PropertyScreeningActivity>;
};

function propertyActivityLabel(
  activity: PropertyScreeningActivity | undefined,
): string {
  if (!activity) return "No screenings yet";
  const count = `${activity.screeningCount} screening${activity.screeningCount === 1 ? "" : "s"}`;
  return `${count} · Last ${formatRelativeTime(activity.lastScreenedAt)}`;
}

export function DashboardPropertiesList({
  properties,
  propertyActivity,
}: DashboardPropertiesListProps) {
  const [propertyQuery, setPropertyQuery] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const haystack = `${p.addressLine1} ${p.city} ${p.postcode}`.toLowerCase();
      return haystack.includes(propertyQuery.toLowerCase());
    });
  }, [properties, propertyQuery]);

  return (
    <section className="space-y-4 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-h3 font-semibold text-text">Properties</h2>
          <p className="mt-0.5 text-sm text-text-muted">
            Organise screenings by address
          </p>
        </div>
        <Link
          href="/properties/new"
          className="btn-secondary min-h-9 px-3 py-1.5 text-sm"
        >
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
          <p className="text-sm text-text-subtle">
            No properties match your search.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {filteredProperties.map((p) => {
            const activity = propertyActivity[p.id];
            const canCompare = (activity?.screeningCount ?? 0) >= 2;

            return (
              <li key={p.id}>
                <Link
                  href={`/properties/${p.id}`}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:border-brand-600 hover:bg-brand-50/30"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-muted transition-colors group-hover:bg-brand-50 group-hover:text-brand-ink"
                    aria-hidden
                  >
                    <Building2 className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-text group-hover:text-brand-700">
                        {p.addressLine1}
                      </p>
                      {canCompare ? (
                        <StatusBadge variant="pro">
                          <GitCompare
                            className="mr-1 inline h-3 w-3"
                            aria-hidden
                          />
                          Compare
                        </StatusBadge>
                      ) : null}
                    </div>
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
                          activity
                            ? "text-text-muted"
                            : "text-text-subtle italic"
                        }
                      >
                        {propertyActivityLabel(activity)}
                      </span>
                    </div>
                    {canCompare ? (
                      <p className="mt-1.5 text-xs text-brand-700">
                        {activity!.screeningCount} applicants ready to compare
                      </p>
                    ) : null}
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
  );
}
