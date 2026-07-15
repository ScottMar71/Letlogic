import Link from "next/link";

type MarketingCtaBandProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  className?: string;
};

/** Standard navy conversion band used across marketing / content pages. */
export function MarketingCtaBand({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className = "",
}: MarketingCtaBandProps) {
  return (
    <section
      className={`rounded-2xl border border-brand-700 bg-brand-700 p-8 text-center text-white ${className}`}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-brand-100">{description}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link href={primaryHref} className="btn-onbrand">
          {primaryLabel}
        </Link>
        <Link href={secondaryHref} className="btn-onbrand-secondary px-5">
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
