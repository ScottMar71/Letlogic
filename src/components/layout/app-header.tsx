import { getCachedCreditBalance } from "@/lib/screening/session";
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
  const balance =
    creditBalance ?? (await getCachedCreditBalance());

  return <AppHeaderShell creditBalance={balance} width={width} />;
}
