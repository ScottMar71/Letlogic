import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeaderRoute } from "@/components/layout/marketing-header-route";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <MarketingHeaderRoute />
      <div className="flex flex-1 flex-col">{children}</div>
      <MarketingFooter />
    </div>
  );
}
