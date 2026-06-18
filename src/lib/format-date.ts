const SHORT_DATE: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

const LONG_DATE: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

/** e.g. "18 Jun 2026" — tables, metadata, purchase history. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", SHORT_DATE);
}

/** e.g. "18 June 2026" — article headers, guides. */
export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", LONG_DATE);
}

/** e.g. "18 Jun 2026, 14:30" — timestamps with time. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    ...SHORT_DATE,
    hour: "2-digit",
    minute: "2-digit",
  });
}
