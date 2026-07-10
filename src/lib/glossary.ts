/** Plain-text glossary entries — powers /glossary page copy and DefinedTermSet schema. */
export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "affordability",
    term: "Affordability",
    definition:
      "Whether a tenant's income comfortably covers the rent and their other commitments. The single biggest predictor of a sustainable tenancy.",
  },
  {
    slug: "income-multiple",
    term: "Income multiple",
    definition:
      "Gross annual income divided by annual rent. Many landlords look for at least 2.5–3x, used as a guide rather than a hard rule.",
  },
  {
    slug: "guarantor",
    term: "Guarantor",
    definition:
      "A third party who agrees to cover the rent if the tenant cannot. Often used when an applicant's income alone doesn't meet the affordability threshold.",
  },
  {
    slug: "right-to-rent",
    term: "Right to Rent",
    definition:
      "A legal check (England only) that occupiers aged 18+ have the right to rent in the UK. Separate from screening.",
  },
  {
    slug: "ccj-county-court-judgment",
    term: "CCJ (County Court Judgment)",
    definition:
      "A court ruling that someone owes a debt. CCJs appear on credit files and may surface in a credit check rather than in screening.",
  },
  {
    slug: "tenant-referencing",
    term: "Tenant referencing",
    definition:
      "Formal verification of an applicant's employment, income, and previous landlord references.",
  },
  {
    slug: "credit-check",
    term: "Credit check",
    definition:
      "A search of an applicant's credit history with a credit-reference agency.",
  },
  {
    slug: "tenant-screening",
    term: "Tenant screening",
    definition:
      "Assessing whether a prospective tenant is likely to sustain a tenancy, based on affordability and stability.",
  },
];
