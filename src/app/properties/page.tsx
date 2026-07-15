import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, ChevronRight } from "lucide-react";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCreditBalance } from "@/lib/screening/credits";
import {
  listProperties,
  listPropertyScreeningActivity,
} from "@/lib/screening/queries";
import { getAuthenticatedUser } from "@/lib/screening/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { formatRelativeTime } from "@/lib/format-relative-time";

export const metadata = privatePageMetadata("Properties");

export default async function PropertiesPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?next=/properties");

  const admin = createAdminClient();
  const [properties, activity, balance] = await Promise.all([
    listProperties(admin, user.id),
    listPropertyScreeningActivity(admin, user.id),
    getCreditBalance(admin, user.id),
  ]);

  return (
    <AuthenticatedPage creditBalance={balance} width="content">
      <PageHeader
        title="Properties"
        description="Track screenings by address and compare applicants."
        actions={
          <Link href="/properties/new" className="btn-primary">
            Add property
          </Link>
        }
      />

      {properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="Add a property to organise screenings by address."
          actionLabel="Add property"
          actionHref="/properties/new"
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => {
            const stats = activity[p.id];
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
                    <p className="font-medium text-text group-hover:text-brand-700">
                      {p.addressLine1}
                    </p>
                    <p className="text-sm text-text-subtle">
                      {p.city}, {p.postcode}
                    </p>
                    {p.rentAmount ? (
                      <p className="mt-1 text-xs font-medium text-text-muted">
                        £{p.rentAmount.toLocaleString("en-GB")}/mo
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-text-subtle">
                      {stats
                        ? `${stats.screeningCount} screening${stats.screeningCount === 1 ? "" : "s"} · Last ${formatRelativeTime(stats.lastScreenedAt)}`
                        : "No screenings yet"}
                    </p>
                  </div>
                  <ChevronRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-text-subtle"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AuthenticatedPage>
  );
}
