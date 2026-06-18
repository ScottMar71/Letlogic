import { AuthenticatedPageLoading } from "@/components/layout/authenticated-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScreenLoading() {
  return (
    <AuthenticatedPageLoading width="wide" ariaLabel="Loading screen workspace" mainClassName="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-[28rem] rounded-xl" />
    </AuthenticatedPageLoading>
  );
}
