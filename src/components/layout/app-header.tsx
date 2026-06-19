import { getCachedCreditBalance, getCachedIsAdmin } from "@/lib/screening/session";
import { AppHeaderShell } from "./app-header-shell";
import type { AppLayoutWidth } from "./authenticated-page";

type AppHeaderProps = {
  creditBalance?: number;
  width?: AppLayoutWidth;
};

export async function AppHeader({
  creditBalance,
  width = "content",
}: AppHeaderProps) {
  const [balance, isAdmin] = await Promise.all([
    creditBalance ?? getCachedCreditBalance(),
    getCachedIsAdmin(),
  ]);

  return (
    <AppHeaderShell creditBalance={balance} isAdmin={isAdmin} width={width} />
  );
}
