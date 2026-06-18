import { notFound, redirect } from "next/navigation";
import { AuthenticatedPage } from "@/components/layout/authenticated-page";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
} from "@/components/ui/table";
import { isAdminEmail } from "@/lib/admin/auth";
import { getAdminOverview } from "@/lib/admin/queries";
import { privatePageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/format-date";
import { formatGbp } from "@/lib/screening/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedUser } from "@/lib/screening/session";

export const metadata = privatePageMetadata("Admin");

const orderStatusVariant = {
  completed: "success",
  pending: "warning",
  refunded: "neutral",
} as const;

const subscriptionStatusVariant = {
  active: "success",
  trialing: "pro",
  past_due: "warning",
  canceled: "neutral",
} as const;

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function AdminPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdminEmail(user.email)) notFound();

  const overview = await getAdminOverview(createAdminClient());

  const stats = [
    {
      label: "Users",
      value: overview.totalUsers.toLocaleString("en-GB"),
      hint: "Total profiles",
    },
    {
      label: "Orders",
      value: overview.totalOrders.toLocaleString("en-GB"),
      hint: `${overview.completedOrders.toLocaleString("en-GB")} completed`,
    },
    {
      label: "Revenue",
      value: formatGbp(overview.totalRevenuePence),
      hint: "Completed orders",
    },
    {
      label: "Screenings",
      value: overview.totalScreenings.toLocaleString("en-GB"),
      hint: "Total assessments",
    },
  ];

  return (
    <AuthenticatedPage width="wide">
      <PageHeader
          title="Admin"
          description="View users, orders, and screening activity across LetLogic."
        />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Admin summary">
          {stats.map((stat) => (
            <Card key={stat.label} padding="sm">
              <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-text">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-text-muted">{stat.hint}</p>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-h3 font-semibold text-text">Users</h2>
            <p className="mt-0.5 text-sm text-text-muted">
              Accounts with plan, usage, and billing signals.
            </p>
          </div>

          {overview.users.length === 0 ? (
            <EmptyState
              title="No users found"
              description="Profiles will appear here after users sign up."
            />
          ) : (
            <Table caption="Admin user list">
              <TableHead>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Plan</TableHeaderCell>
                <TableHeaderCell>Subscription</TableHeaderCell>
                <TableHeaderCell className="text-right">Orders</TableHeaderCell>
                <TableHeaderCell className="text-right">Spend</TableHeaderCell>
                <TableHeaderCell className="text-right">Credits</TableHeaderCell>
                <TableHeaderCell className="text-right">Screenings</TableHeaderCell>
                <TableHeaderCell>Joined</TableHeaderCell>
              </TableHead>
              <TableBody>
                {overview.users.map((adminUser) => (
                  <tr key={adminUser.id}>
                    <TableCell>
                      <div className="min-w-48">
                        <p className="font-medium text-text">
                          {adminUser.fullName || "Unnamed user"}
                        </p>
                        <p className="text-xs text-text-subtle">
                          {adminUser.email ?? "No email"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={adminUser.plan === "pro" ? "pro" : "default"}>
                        {formatLabel(adminUser.plan)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {adminUser.subscriptionStatus ? (
                        <StatusBadge
                          variant={
                            subscriptionStatusVariant[
                              adminUser.subscriptionStatus as keyof typeof subscriptionStatusVariant
                            ] ?? "neutral"
                          }
                        >
                          {formatLabel(adminUser.subscriptionStatus)}
                        </StatusBadge>
                      ) : (
                        <span className="text-sm text-text-subtle">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {adminUser.orderCount.toLocaleString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatGbp(adminUser.totalSpendPence)}
                    </TableCell>
                    <TableCell className="text-right">
                      {adminUser.creditBalance.toLocaleString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right">
                      {adminUser.screeningCount.toLocaleString("en-GB")}
                    </TableCell>
                    <TableCell>{formatDate(adminUser.createdAt)}</TableCell>
                  </tr>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-h3 font-semibold text-text">Orders</h2>
            <p className="mt-0.5 text-sm text-text-muted">
              Credit pack and subscription purchase records.
            </p>
          </div>

          {overview.orders.length === 0 ? (
            <EmptyState
              title="No orders found"
              description="Orders will appear here after checkout sessions are created."
            />
          ) : (
            <Table caption="Admin order list">
              <TableHead>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Credits</TableHeaderCell>
                <TableHeaderCell className="text-right">Amount</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
              </TableHead>
              <TableBody>
                {overview.orders.map((order) => (
                  <tr key={order.id}>
                    <TableCell>
                      <span className="font-mono text-xs text-text-subtle">
                        {order.id.slice(0, 8)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-48">
                        <p className="font-medium text-text">
                          {order.userName || "Unnamed user"}
                        </p>
                        <p className="text-xs text-text-subtle">
                          {order.userEmail ?? order.userId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-text">{formatLabel(order.type)}</p>
                        {order.packSlug ? (
                          <p className="text-xs text-text-subtle">{order.packSlug}</p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        variant={
                          orderStatusVariant[
                            order.status as keyof typeof orderStatusVariant
                          ] ?? "neutral"
                        }
                      >
                        {formatLabel(order.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.creditsTotal.toLocaleString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatGbp(order.amountPence)}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </tr>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
    </AuthenticatedPage>
  );
}
