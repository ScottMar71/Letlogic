import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

type AdminUserRow = {
  id: string;
  email: string | null;
  fullName: string | null;
  plan: string;
  createdAt: string;
  orderCount: number;
  totalSpendPence: number;
  creditBalance: number;
  screeningCount: number;
  subscriptionStatus: string | null;
};

type AdminOrderRow = {
  id: string;
  userId: string;
  userEmail: string | null;
  userName: string | null;
  type: string;
  packSlug: string | null;
  amountPence: number;
  creditsTotal: number;
  status: string;
  createdAt: string;
};

export type AdminOverview = {
  totalUsers: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenuePence: number;
  totalScreenings: number;
  users: AdminUserRow[];
  orders: AdminOrderRow[];
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string;
  created_at: string;
};

type PurchaseRow = {
  id: string;
  user_id: string;
  type: string;
  pack_slug: string | null;
  amount_pence: number;
  credits_total: number;
  status: string;
  created_at: string;
  profiles?: {
    email?: string | null;
    full_name?: string | null;
  } | null;
};

type SubscriptionRow = {
  user_id: string;
  status: string;
};

type AssessmentRow = {
  user_id: string;
};

type CreditLedgerRow = {
  user_id: string;
  delta: number;
};

function assertQuery(error: { message?: string } | null, label: string) {
  if (error) throw new Error(`Failed to load admin ${label}: ${error.message}`);
}

async function fetchAllRows<T>(
  label: string,
  loadPage: (
    from: number,
    to: number,
  ) => Promise<{ data: T[] | null; error: { message?: string } | null }>,
): Promise<T[]> {
  const pageSize = 1000;
  const rows: T[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await loadPage(from, from + pageSize - 1);
    assertQuery(error, label);

    const page = data ?? [];
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

function increment(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

export async function getAdminOverview(
  admin: SupabaseClient,
): Promise<AdminOverview> {
  const [
    profiles,
    purchases,
    subscriptions,
    assessments,
    creditLedger,
    profileCountRes,
    purchaseCountRes,
    completedPurchaseCountRes,
    assessmentCountRes,
  ] = await Promise.all([
    fetchAllRows<ProfileRow>("users", async (from, to) => {
      const { data, error } = await admin
        .from("profiles")
        .select("id, email, full_name, plan, created_at")
        .order("created_at", { ascending: false })
        .range(from, to);
      return { data: (data as ProfileRow[] | null) ?? null, error };
    }),
    fetchAllRows<PurchaseRow>("orders", async (from, to) => {
      const { data, error } = await admin
        .from("purchases")
        .select(
          "id, user_id, type, pack_slug, amount_pence, credits_total, status, created_at, profiles(email, full_name)",
        )
        .order("created_at", { ascending: false })
        .range(from, to);
      return { data: (data as PurchaseRow[] | null) ?? null, error };
    }),
    fetchAllRows<SubscriptionRow>("subscriptions", async (from, to) => {
      const { data, error } = await admin
        .from("subscriptions")
        .select("user_id, status")
        .order("created_at", { ascending: false })
        .range(from, to);
      return { data: (data as SubscriptionRow[] | null) ?? null, error };
    }),
    fetchAllRows<AssessmentRow>("screening counts", async (from, to) => {
      const { data, error } = await admin
        .from("assessments")
        .select("user_id")
        .range(from, to);
      return { data: (data as AssessmentRow[] | null) ?? null, error };
    }),
    fetchAllRows<CreditLedgerRow>("credit balances", async (from, to) => {
      const { data, error } = await admin
        .from("credit_ledger")
        .select("user_id, delta")
        .range(from, to);
      return { data: (data as CreditLedgerRow[] | null) ?? null, error };
    }),
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("purchases").select("id", { count: "exact", head: true }),
    admin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed"),
    admin.from("assessments").select("id", { count: "exact", head: true }),
  ]);

  assertQuery(profileCountRes.error, "user count");
  assertQuery(purchaseCountRes.error, "order count");
  assertQuery(completedPurchaseCountRes.error, "completed order count");
  assertQuery(assessmentCountRes.error, "screening total");

  const orderCounts = new Map<string, number>();
  const spendByUser = new Map<string, number>();
  for (const purchase of purchases) {
    increment(orderCounts, purchase.user_id);
    if (purchase.status === "completed") {
      increment(spendByUser, purchase.user_id, purchase.amount_pence);
    }
  }

  const screeningCounts = new Map<string, number>();
  for (const assessment of assessments) {
    increment(screeningCounts, assessment.user_id);
  }

  const creditBalances = new Map<string, number>();
  for (const entry of creditLedger) {
    increment(creditBalances, entry.user_id, entry.delta);
  }

  const subscriptionStatuses = new Map<string, string>();
  for (const subscription of subscriptions) {
    if (!subscriptionStatuses.has(subscription.user_id)) {
      subscriptionStatuses.set(subscription.user_id, subscription.status);
    }
  }

  const users = profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    plan: profile.plan,
    createdAt: profile.created_at,
    orderCount: orderCounts.get(profile.id) ?? 0,
    totalSpendPence: spendByUser.get(profile.id) ?? 0,
    creditBalance: creditBalances.get(profile.id) ?? 0,
    screeningCount: screeningCounts.get(profile.id) ?? 0,
    subscriptionStatus: subscriptionStatuses.get(profile.id) ?? null,
  }));

  const orders = purchases.map((purchase) => ({
    id: purchase.id,
    userId: purchase.user_id,
    userEmail: purchase.profiles?.email ?? null,
    userName: purchase.profiles?.full_name ?? null,
    type: purchase.type,
    packSlug: purchase.pack_slug,
    amountPence: purchase.amount_pence,
    creditsTotal: purchase.credits_total,
    status: purchase.status,
    createdAt: purchase.created_at,
  }));

  return {
    totalUsers: profileCountRes.count ?? users.length,
    totalOrders: purchaseCountRes.count ?? orders.length,
    completedOrders: completedPurchaseCountRes.count ?? 0,
    totalRevenuePence: purchases
      .filter((purchase) => purchase.status === "completed")
      .reduce(
        (total, purchase) => total + purchase.amount_pence,
        0,
      ),
    totalScreenings: assessmentCountRes.count ?? assessments.length,
    users,
    orders,
  };
}
