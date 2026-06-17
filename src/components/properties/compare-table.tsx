import { RiskChip } from "@/components/screening/risk-chip";
import { RECOMMENDATION_LABELS } from "@/lib/screening/types";
import type { Recommendation } from "@/lib/screening/schema";
import type { AssessmentSummary } from "@/lib/screening/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRowHeader,
} from "@/components/ui/table";

export function CompareTable({ applicants }: { applicants: AssessmentSummary[] }) {
  return (
    <div className="hidden md:block">
      <Table caption="Applicant comparison metrics">
        <TableHead>
          <TableHeaderCell sticky>Metric</TableHeaderCell>
          {applicants.map((a) => (
            <TableHeaderCell key={a.id}>{a.applicantName}</TableHeaderCell>
          ))}
        </TableHead>
        <TableBody>
          <tr>
            <TableRowHeader sticky>Risk</TableRowHeader>
            {applicants.map((a) => (
              <TableCell key={a.id}>
                <RiskChip level={a.riskLevel} score={a.riskScore} />
              </TableCell>
            ))}
          </tr>
          <tr>
            <TableRowHeader sticky>Income multiple</TableRowHeader>
            {applicants.map((a) => (
              <TableCell key={a.id} className="whitespace-nowrap">
                {a.incomeMultiple != null ? `${a.incomeMultiple}x` : "—"}
              </TableCell>
            ))}
          </tr>
          <tr>
            <TableRowHeader sticky>Recommendation</TableRowHeader>
            {applicants.map((a) => (
              <TableCell key={a.id}>
                {RECOMMENDATION_LABELS[a.recommendation as Recommendation] ??
                  a.recommendation}
              </TableCell>
            ))}
          </tr>
        </TableBody>
      </Table>
    </div>
  );
}
