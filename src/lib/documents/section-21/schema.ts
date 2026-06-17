import { z } from "zod";

export const section21Schema = z.object({
  landlordName: z.string().min(2, "Landlord name is required"),
  landlordAddress: z.string().min(5, "Landlord address is required"),
  propertyAddressLine1: z.string().min(3, "Property address is required"),
  propertyAddressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  postcode: z
    .string()
    .min(5, "Valid UK postcode required")
    .regex(/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, "Enter a valid UK postcode"),
  jurisdiction: z.literal("england_wales"),
  tenancyStartDate: z.string().min(1, "Tenancy start date is required"),
  tenantNames: z
    .array(z.string().min(2))
    .min(1, "At least one tenant name is required")
    .max(6),
  rentAmount: z.coerce.number().positive("Rent must be greater than zero"),
  depositScheme: z.string().optional(),
  possessionDate: z.string().min(1, "Date tenant should leave is required"),
});

export type Section21FormData = z.infer<typeof section21Schema>;

export const section21Defaults: Section21FormData = {
  landlordName: "",
  landlordAddress: "",
  propertyAddressLine1: "",
  propertyAddressLine2: "",
  city: "",
  postcode: "",
  jurisdiction: "england_wales",
  tenancyStartDate: "",
  tenantNames: [""],
  rentAmount: 0,
  depositScheme: "",
  possessionDate: "",
};
