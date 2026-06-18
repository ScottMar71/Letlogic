import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { createProperty } from "@/app/actions/properties";
import { PageHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("Add property");

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function NewPropertyPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/properties/new");

  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader width="narrow" />
      <main id="main-content" className="mx-auto max-w-[var(--container-narrow)] space-y-6 px-4 py-8">
        <PageHeader
          title="Add a property"
          description="Track screenings by address and compare applicants for the same let."
          breadcrumbs={[
            { label: "Properties", href: "/properties" },
            { label: "Add property" },
          ]}
        />
        {error && <Alert variant="error">{error}</Alert>}
        <form action={createProperty} className="space-y-4">
          <label className="block space-y-1">
            <span className="field-label">Address line 1</span>
            <input name="addressLine1" required className="input" placeholder="14 Oak Street" />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="field-label">City</span>
              <input name="city" required className="input" placeholder="Manchester" />
            </label>
            <label className="block space-y-1">
              <span className="field-label">Postcode</span>
              <input name="postcode" required className="input" placeholder="M1 2AB" />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="field-label">Monthly rent (£)</span>
            <input name="rentAmount" type="number" required className="input" placeholder="1200" />
          </label>
          <button type="submit" className="btn-primary px-5">
            Save property
          </button>
        </form>
      </main>
    </div>
  );
}
