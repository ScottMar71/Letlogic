import { AuthenticatedPageLoading } from "@/components/layout/authenticated-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScreeningDetailLoading() {
  return (
    <AuthenticatedPageLoading width="narrow" ariaLabel="Loading screening report" mainClassName="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </AuthenticatedPageLoading>
  );
}
