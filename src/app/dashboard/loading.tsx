import { AuthenticatedPageLoading } from "@/components/layout/authenticated-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <AuthenticatedPageLoading width="content" ariaLabel="Loading dashboard">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-11 w-28" />
          <Skeleton className="h-11 w-36" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-36 rounded-lg" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-44" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </AuthenticatedPageLoading>
  );
}
