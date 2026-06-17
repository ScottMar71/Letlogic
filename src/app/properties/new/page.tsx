import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { createProperty } from "@/app/actions/properties";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Add property" };

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
      <main className="mx-auto max-w-[var(--container-narrow)] px-4 py-8">
        <h1 className="text-2xl font-bold text-text">Add a property</h1>
        <p className="mb-6 text-sm text-text-muted">
          Track screenings by address and compare applicants for the same let.
        </p>
        {error && (
          <p className="mb-4 rounded-lg border border-danger-border bg-danger-bg p-3 text-sm text-danger">
            {error}
          </p>
        )}
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
