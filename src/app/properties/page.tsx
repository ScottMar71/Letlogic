import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listProperties } from "@/lib/screening/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Properties" };

export default async function PropertiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/properties");

  const properties = await listProperties(createAdminClient(), user.id);

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="content" />

      <main id="main-content" className="mx-auto max-w-[var(--container-content)] space-y-8 px-4 py-8">
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
            {properties.map((p) => (
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
      </main>
    </div>
  );
}
