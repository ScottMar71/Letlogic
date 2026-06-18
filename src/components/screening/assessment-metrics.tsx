import { Briefcase, Home, PoundSterling } from "lucide-react";
import { Card } from "@/components/ui/card";

type AssessmentMetricsProps = {
  incomeMultiple: number | null;
  jobStabilityScore: number | null;
  tenancyStabilityScore: number | null;
};

const metricConfig = [
  {
    key: "income",
    label: "Income multiple",
    icon: PoundSterling,
    accent: "bg-success-bg text-success",
    getValue: (m: AssessmentMetricsProps) =>
      m.incomeMultiple != null ? `${m.incomeMultiple}x` : "—",
    getHint: (m: AssessmentMetricsProps) =>
      m.incomeMultiple != null
        ? "Gross monthly income vs rent"
        : "Not enough income data",
  },
  {
    key: "job",
    label: "Job stability",
    icon: Briefcase,
    accent: "bg-info-bg text-info",
    getValue: (m: AssessmentMetricsProps) =>
      m.jobStabilityScore != null ? `${m.jobStabilityScore}/10` : "—",
    getHint: (m: AssessmentMetricsProps) =>
      m.jobStabilityScore != null
        ? "Employment history and tenure"
        : "Employment details missing",
  },
  {
    key: "tenancy",
    label: "Tenancy stability",
    icon: Home,
    accent: "bg-brand-50 text-brand-600",
    getValue: (m: AssessmentMetricsProps) =>
      m.tenancyStabilityScore != null ? `${m.tenancyStabilityScore}/10` : "—",
    getHint: (m: AssessmentMetricsProps) =>
      m.tenancyStabilityScore != null
        ? "Rental history and address gaps"
        : "Rental history not stated",
  },
] as const;

export function AssessmentMetrics(props: AssessmentMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {metricConfig.map((metric) => {
        const Icon = metric.icon;
        const value = metric.getValue(props);
        const hint = metric.getHint(props);

        return (
          <Card key={metric.key} padding="sm" className="h-full">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${metric.accent}`}
              aria-hidden
            >
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-text-subtle">
              {metric.label}
            </p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-text">
              {value}
            </p>
            <p className="mt-1 text-xs text-text-muted">{hint}</p>
          </Card>
        );
      })}
    </div>
  );
}
