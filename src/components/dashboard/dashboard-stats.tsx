import { Card } from "@/components/ui/card";

type DashboardStatsProps = {
  balance: number;
  propertyCount: number;
  screeningCount: number;
  screeningsThisMonth: number;
};

export function DashboardStats({
  balance,
  propertyCount,
  screeningCount,
  screeningsThisMonth,
}: DashboardStatsProps) {
  const stats = [
    { label: "Credits", value: String(balance) },
    { label: "Properties", value: String(propertyCount) },
    { label: "Total screenings", value: String(screeningCount) },
    { label: "This month", value: String(screeningsThisMonth) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} padding="sm">
          <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-text">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
