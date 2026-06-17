"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const propertySchema = z.object({
  addressLine1: z.string().trim().min(3, "Address is required"),
  city: z.string().trim().min(2, "City is required"),
  postcode: z.string().trim().min(5, "Valid UK postcode required"),
  rentAmount: z.coerce.number().positive("Monthly rent is required"),
});

export async function createProperty(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/properties/new");

  const parsed = propertySchema.safeParse({
    addressLine1: formData.get("addressLine1"),
    city: formData.get("city"),
    postcode: formData.get("postcode"),
    rentAmount: formData.get("rentAmount"),
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    redirect(`/properties/new?error=${encodeURIComponent(msg)}`);
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("properties")
    .insert({
      user_id: user.id,
      address_line1: parsed.data.addressLine1,
      city: parsed.data.city,
      postcode: parsed.data.postcode.toUpperCase(),
      jurisdiction: "england_wales",
      rent_amount: parsed.data.rentAmount,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/properties/new?error=Could+not+save+property");
  }

  redirect(`/properties/${data.id}`);
}
