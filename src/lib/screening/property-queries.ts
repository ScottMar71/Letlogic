import type { SupabaseClient } from "@supabase/supabase-js";

export type PropertyRow = {
  id: string;
  addressLine1: string;
  city: string;
  postcode: string;
  rentAmount: number | null;
};

export type PropertyScreeningActivity = {
  screeningCount: number;
  lastScreenedAt: string;
};

function toPropertyRow(data: {
  id: string;
  address_line1: string;
  city: string;
  postcode: string;
  rent_amount: number | null;
}): PropertyRow {
  return {
    id: data.id,
    addressLine1: data.address_line1,
    city: data.city,
    postcode: data.postcode,
    rentAmount: data.rent_amount ?? null,
  };
}

export async function getPropertyForUser(
  admin: SupabaseClient,
  userId: string,
  propertyId: string,
): Promise<PropertyRow | null> {
  const { data } = await admin
    .from("properties")
    .select("id, address_line1, city, postcode, rent_amount")
    .eq("id", propertyId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .single();
  if (!data) return null;
  return toPropertyRow(
    data as {
      id: string;
      address_line1: string;
      city: string;
      postcode: string;
      rent_amount: number | null;
    },
  );
}

export async function listProperties(
  admin: SupabaseClient,
  userId: string,
): Promise<PropertyRow[]> {
  const { data } = await admin
    .from("properties")
    .select("id, address_line1, city, postcode, rent_amount")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  return (data ?? []).map((p) =>
    toPropertyRow(
      p as {
        id: string;
        address_line1: string;
        city: string;
        postcode: string;
        rent_amount: number | null;
      },
    ),
  );
}

export async function listPropertyScreeningActivity(
  admin: SupabaseClient,
  userId: string,
): Promise<Record<string, PropertyScreeningActivity>> {
  const { data } = await admin
    .from("assessments")
    .select("created_at, applications!inner(property_id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const result: Record<string, PropertyScreeningActivity> = {};
  for (const row of data ?? []) {
    const raw = row as Record<string, unknown>;
    const app = (raw.applications ?? {}) as { property_id: string | null };
    const propertyId = app.property_id;
    if (!propertyId) continue;

    const createdAt = row.created_at as string;
    const existing = result[propertyId];
    if (!existing) {
      result[propertyId] = { screeningCount: 1, lastScreenedAt: createdAt };
    } else {
      existing.screeningCount++;
    }
  }
  return result;
}
