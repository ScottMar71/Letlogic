import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeaderRoute } from "@/components/layout/marketing-header-route";
import { getAuthenticatedUser } from "@/lib/screening/session";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <MarketingHeaderRoute isAuthenticated={!!user} />
      <div className="flex flex-1 flex-col">{children}</div>
      <MarketingFooter />
    </div>
  );
}
