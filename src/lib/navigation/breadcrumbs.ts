import type { BreadcrumbItem } from "@/components/ui/breadcrumbs";

export const HOME_BREADCRUMB: BreadcrumbItem = { label: "Home", href: "/" };

export function withHomeBreadcrumb(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [HOME_BREADCRUMB, ...items];
}
