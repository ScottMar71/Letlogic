import { AppHeader } from "@/components/layout/app-header";
import { AppHeaderShell } from "@/components/layout/app-header-shell";

export type AppLayoutWidth = "narrow" | "content" | "wide";

const mainWidthClass: Record<AppLayoutWidth, string> = {
  narrow: "max-w-[var(--container-narrow)]",
  content: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
};

type AuthenticatedPageProps = {
  children: React.ReactNode;
  width?: AppLayoutWidth;
  creditBalance?: number;
  /** Extra classes appended to the default main layout (e.g. space-y-8). */
  mainClassName?: string;
};

export function AuthenticatedPage({
  children,
  width = "content",
  creditBalance,
  mainClassName = "space-y-8",
}: AuthenticatedPageProps) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeader creditBalance={creditBalance} width={width} />
      <main
        id="main-content"
        className={`mx-auto ${mainWidthClass[width]} px-4 py-8 ${mainClassName}`}
      >
        {children}
      </main>
    </div>
  );
}

type AuthenticatedPageLoadingProps = {
  width?: AppLayoutWidth;
  ariaLabel?: string;
  mainClassName?: string;
  children: React.ReactNode;
};

/** Skeleton shell without server fetches — use in route loading.tsx files. */
export function AuthenticatedPageLoading({
  width = "content",
  ariaLabel = "Loading page",
  mainClassName = "space-y-8",
  children,
}: AuthenticatedPageLoadingProps) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <AppHeaderShell width={width} />
      <main
        id="main-content"
        className={`mx-auto ${mainWidthClass[width]} px-4 py-8 ${mainClassName}`}
        aria-busy="true"
        aria-label={ariaLabel}
      >
        {children}
      </main>
    </div>
  );
}
