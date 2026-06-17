import Link from "next/link";
import { site } from "@/lib/site";

const variants = {
  horizontal: {
    src: "/brand/logo-horizontal.svg",
    width: 296,
    height: 100,
  },
  stacked: {
    src: "/brand/logo-stacked.svg",
    width: 160,
    height: 136,
  },
  icon: {
    src: "/brand/icon.svg",
    width: 80,
    height: 80,
  },
} as const;

type LogoVariant = keyof typeof variants;
type LogoSize = "xs" | "sm" | "md" | "lg" | "nav";

const heights: Record<LogoSize, string> = {
  xs: "h-5",
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  nav: "h-24",
};

type LogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
};

export function Logo({
  variant = "horizontal",
  size = "md",
  className,
}: LogoProps) {
  const { src, width, height } = variants[variant];

  return (
    // eslint-disable-next-line @next/next/no-img-element -- brand SVGs are static assets
    <img
      src={src}
      alt={site.name}
      width={width}
      height={height}
      className={`w-auto ${heights[size]}${className ? ` ${className}` : ""}`}
    />
  );
}

type LogoLinkProps = LogoProps & {
  href?: string;
};

export function LogoLink({ href = "/", ...props }: LogoLinkProps) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      <Logo {...props} />
    </Link>
  );
}
