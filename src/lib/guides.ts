/** Registry of long-form guides — powers the /guides hub and per-guide metadata. */
export type Guide = {
  slug: string;
  title: string;
  /** Meta description (140–160 chars). */
  description: string;
  /** Short summary shown in the hub list. */
  summary: string;
  /** ISO date the guide was first published. */
  datePublished: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "tenant-affordability",
    title: "How to assess tenant affordability",
    description:
      "How UK landlords assess whether a tenant can afford the rent — income multiples, what counts as income, and the affordability signals that predict a sustainable tenancy.",
    summary:
      "Income multiples, what counts as income, and how to judge whether the rent is genuinely affordable.",
    datePublished: "2026-06-18",
  },
  {
    slug: "right-to-rent",
    title: "Right to Rent checks explained",
    description:
      "A plain-English guide to Right to Rent checks for landlords in England — who must be checked, accepted documents, and how it differs from tenant screening.",
    summary:
      "Who must be checked, which documents are accepted, and how Right to Rent differs from screening.",
    datePublished: "2026-06-18",
  },
  {
    slug: "reading-a-tenant-application",
    title: "How to read a tenant application",
    description:
      "A practical walkthrough for UK landlords on reading a tenant application — the signals that matter, the red flags to probe, and the follow-up questions to ask.",
    summary:
      "The signals that matter, common red flags, and the follow-up questions worth asking.",
    datePublished: "2026-06-18",
  },
  {
    slug: "tenant-vetting",
    title: "Tenant vetting in the UK",
    description:
      "A complete guide to tenant vetting and referencing for UK landlords — identity checks, Right to Rent, affordability, credit checks, legal constraints, and where AI screening fits.",
    summary:
      "What vetting covers, the law you must follow, and how screening tools like LetLogic fit into a compliant process.",
    datePublished: "2026-06-19",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function guidePath(slug: string): string {
  return `/guides/${slug}`;
}
