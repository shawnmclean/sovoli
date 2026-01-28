"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "@sovoli/ui/components/chart";

import type { BillingInvoice, BillingPayment } from "~/modules/billing/types";
import type {
  AmountByCurrency,
  CurrencyCode,
} from "~/modules/core/economics/types";
import { ORGS } from "~/modules/data/organisations";
import type { OrgInstance } from "~/modules/organisations/types";

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getPaidChipColor(isPaid: boolean | undefined) {
  if (isPaid === true) return "success" as const;
  if (isPaid === false) return "danger" as const;
  return "default" as const;
}

function countOpenInvoices(invoices: BillingInvoice[] | undefined): number {
  return (invoices ?? []).filter((inv) => inv.status === "open").length;
}

function countPayments(
  invoices: BillingInvoice[] | undefined,
  payments: BillingPayment[] | undefined,
): number {
  const invoicePaymentsCount =
    invoices?.reduce((sum, inv) => sum + (inv.payments?.length ?? 0), 0) ?? 0;
  return invoicePaymentsCount + (payments?.length ?? 0);
}

function addAmountByCurrency(into: AmountByCurrency, add?: AmountByCurrency) {
  if (!add) return;
  for (const currency of Object.keys(add) as CurrencyCode[]) {
    const value = add[currency];
    if (typeof value !== "number") continue;
    into[currency] = (into[currency] ?? 0) + value;
  }
}

function subtractAmountByCurrency(
  into: AmountByCurrency,
  subtract?: AmountByCurrency,
) {
  if (!subtract) return;
  for (const currency of Object.keys(subtract) as CurrencyCode[]) {
    const value = subtract[currency];
    if (typeof value !== "number") continue;
    into[currency] = (into[currency] ?? 0) - value;
  }
}

function clampAmountByCurrencyToNonNegative(into: AmountByCurrency) {
  for (const currency of Object.keys(into) as CurrencyCode[]) {
    const value = into[currency];
    if (typeof value !== "number") continue;
    if (value <= 0) {
      delete into[currency];
    } else {
      into[currency] = value;
    }
  }
}

function formatAmountByCurrency(amount?: AmountByCurrency): string {
  if (!amount) return "—";

  const entries = (
    Object.entries(amount) as [CurrencyCode, number | undefined][]
  ).filter(([, value]) => typeof value === "number" && value !== 0) as [
    CurrencyCode,
    number,
  ][];

  if (entries.length === 0) return "—";

  return entries
    .map(([currency, value]) => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      });
      return formatter.format(value);
    })
    .join(" • ");
}

function isInUtcYearMonth(
  iso: string | undefined,
  year: number,
  monthIndex: number,
): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return d.getUTCFullYear() === year && d.getUTCMonth() === monthIndex;
}

const COLORS = [
  "hsl(var(--heroui-primary))",
  "hsl(var(--heroui-success))",
  "hsl(var(--heroui-warning))",
  "hsl(var(--heroui-danger))",
  "hsl(var(--heroui-secondary))",
];

export default function AdminBillingPage() {
  const nowIso = new Date().toISOString();
  const now = new Date();
  const thisYear = now.getUTCFullYear();
  const thisMonthIndex = now.getUTCMonth();
  const nextMonthDate = new Date(Date.UTC(thisYear, thisMonthIndex + 1, 1));
  const nextYear = nextMonthDate.getUTCFullYear();
  const nextMonthIndex = nextMonthDate.getUTCMonth();

  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const thisMonthLabel = monthFormatter.format(
    new Date(Date.UTC(thisYear, thisMonthIndex, 1)),
  );
  const nextMonthLabel = monthFormatter.format(
    new Date(Date.UTC(nextYear, nextMonthIndex, 1)),
  );

  const orgs: OrgInstance[] = ORGS;

  const orgsWithInvoices = orgs
    .filter((o) => o.websiteModule?.website.domain)
    .filter((o) => (o.billingModule?.invoices?.length ?? 0) > 0);

  // --- Rollup Calculation ---
  const rollup = (() => {
    const paidAllTime: AmountByCurrency = {};
    const paidThisMonth: AmountByCurrency = {};
    const expectedThisMonth: AmountByCurrency = {};
    const expectedNextMonth: AmountByCurrency = {};

    const paymentById = new Map<string, BillingPayment>();
    const revenueByMonth = new Map<string, number>(); // YYYY-MM -> Total USD (simplified for chart)

    let paidAllTimeCount = 0;
    let paidThisMonthCount = 0;
    let expectedThisMonthCount = 0;
    let expectedNextMonthCount = 0;

    for (const o of orgsWithInvoices) {
      const invoices = o.billingModule?.invoices ?? [];
      const payments = o.billingModule?.payments ?? [];

      for (const inv of invoices) {
        if (inv.status === "open") {
          const invoiceMonthIso = inv.dueAt ?? inv.issuedAt;
          if (isInUtcYearMonth(invoiceMonthIso, thisYear, thisMonthIndex)) {
            addAmountByCurrency(expectedThisMonth, inv.total);
            expectedThisMonthCount += 1;
          } else if (
            isInUtcYearMonth(invoiceMonthIso, nextYear, nextMonthIndex)
          ) {
            addAmountByCurrency(expectedNextMonth, inv.total);
            expectedNextMonthCount += 1;
          }
        }
        for (const p of inv.payments ?? []) {
          paymentById.set(p.id, p);
        }
      }
      for (const p of payments) {
        paymentById.set(p.id, p);
      }
    }

    for (const p of paymentById.values()) {
      if (p.status !== "succeeded") continue;
      addAmountByCurrency(paidAllTime, p.amount);
      paidAllTimeCount += 1;

      if (isInUtcYearMonth(p.paidAt, thisYear, thisMonthIndex)) {
        addAmountByCurrency(paidThisMonth, p.amount);
        paidThisMonthCount += 1;
      }

      // Populate history for chart
      if (p.paidAt) {
        const d = new Date(p.paidAt);
        if (!Number.isNaN(d.getTime())) {
          const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

          // Only aggregating 'USD' roughly or primary currency for the chart?
          // Ideally charts show one currency or stacked. 
          // For simplicity, we assume primary currency is USD or simply take the raw number if mixed 
          // (which is bad but "Scrappy"). 
          // Better: Convert or just pick USD.
          const amt = p.amount.USD ?? p.amount.GYD ?? p.amount.JMD ?? 0; // Simple fallback

          revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + amt);
        }
      }
    }

    // Chart Data: Last 12 months
    const chartData = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(Date.UTC(thisYear, thisMonthIndex - i, 1));
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
      chartData.push({
        name: label,
        revenue: revenueByMonth.get(key) ?? 0
      });
    }

    return {
      paidAllTime,
      paidThisMonth,
      expectedThisMonth,
      expectedNextMonth,
      paidAllTimeCount,
      paidThisMonthCount,
      expectedThisMonthCount,
      expectedNextMonthCount,
      chartData
    };
  })();

  const tenants = orgsWithInvoices
    .map((o) => {
      const subscription = o.billingModule?.subscription;
      const invoices = o.billingModule?.invoices ?? [];
      const modulePayments = o.billingModule?.payments ?? [];
      const derivedIsPaid =
        subscription?.isPaid ??
        (subscription?.paidThrough
          ? subscription.paidThrough >= nowIso
          : undefined);

      const paymentById = new Map<string, BillingPayment>();
      for (const inv of invoices) {
        for (const p of inv.payments ?? []) paymentById.set(p.id, p);
      }
      for (const p of modulePayments) paymentById.set(p.id, p);

      const succeededPaymentsByInvoiceId = new Map<string, BillingPayment[]>();
      const totalPaid: AmountByCurrency = {};
      for (const p of paymentById.values()) {
        if (p.status !== "succeeded") continue;
        addAmountByCurrency(totalPaid, p.amount);
        if (p.invoiceId) {
          const list = succeededPaymentsByInvoiceId.get(p.invoiceId) ?? [];
          list.push(p);
          succeededPaymentsByInvoiceId.set(p.invoiceId, list);
        }
      }

      const amountOwed: AmountByCurrency = {};
      for (const inv of invoices) {
        if (inv.status !== "open") continue;

        addAmountByCurrency(amountOwed, inv.total);

        for (const p of inv.payments ?? []) {
          if (p.status !== "succeeded") continue;
          subtractAmountByCurrency(amountOwed, p.amount);
        }

        for (const p of succeededPaymentsByInvoiceId.get(inv.id) ?? []) {
          subtractAmountByCurrency(amountOwed, p.amount);
        }
      }
      clampAmountByCurrencyToNonNegative(amountOwed);

      return {
        username: o.org.username,
        name: o.org.name,
        planKey: subscription?.planKey ?? "—",
        cadence: subscription?.cadence ?? "—",
        derivedIsPaid,
        lastPaidAt: subscription?.lastPaidAt,
        paidThrough: subscription?.paidThrough,
        nextBillAt: subscription?.nextBillAt,
        openInvoices: countOpenInvoices(invoices),
        invoicesCount: invoices.length,
        paymentsCount: countPayments(invoices, modulePayments),
        amountOwed,
        totalPaid,
      };
    });

  const tenantStatusData = [
    { name: "Paid", value: tenants.filter(t => t.derivedIsPaid === true).length },
    { name: "Overdue/Unpaid", value: tenants.filter(t => t.derivedIsPaid === false).length },
    { name: "Unknown", value: tenants.filter(t => t.derivedIsPaid === undefined).length },
  ].filter(x => x.value > 0);

  return (
    <div className="container mx-auto space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-default-900">Billing Dashboard</h1>
        <p className="text-default-500 text-lg">
          Insights into revenue, subscriptions, and tenant health.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-col items-start gap-1 pb-0">
            <span className="text-xs font-medium uppercase tracking-wider text-default-500">
              Total Revenue (All Time)
            </span>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-extrabold text-default-900">
              {formatAmountByCurrency(rollup.paidAllTime)}
            </div>
            <div className="text-sm font-medium text-success-600">
              {rollup.paidAllTimeCount} payments processed
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-col items-start gap-1 pb-0">
            <span className="text-xs font-medium uppercase tracking-wider text-default-500">
              Revenue This Month
            </span>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-extrabold text-default-900">
                {formatAmountByCurrency(rollup.paidThisMonth)}
              </div>
              <Chip size="sm" color="primary" variant="flat">{thisMonthLabel}</Chip>
            </div>
            <div className="text-sm font-medium text-default-500">
              {rollup.paidThisMonthCount} payments
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-col items-start gap-1 pb-0">
            <span className="text-xs font-medium uppercase tracking-wider text-default-500">
              Expected This Month
            </span>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-extrabold text-warning-600">
                {formatAmountByCurrency(rollup.expectedThisMonth)}
              </div>
              <Chip size="sm" color="warning" variant="flat">{thisMonthLabel}</Chip>
            </div>
            <div className="text-sm font-medium text-default-500">
              {rollup.expectedThisMonthCount} open invoices
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-col items-start gap-1 pb-0">
            <span className="text-xs font-medium uppercase tracking-wider text-default-500">
              Expected Next Month
            </span>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-extrabold text-default-900">
                {formatAmountByCurrency(rollup.expectedNextMonth)}
              </div>
              <Chip size="sm" color="secondary" variant="flat">{nextMonthLabel}</Chip>
            </div>
            <div className="text-sm font-medium text-default-500">
              {rollup.expectedNextMonthCount} invoices due
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Trend */}
        <Card className="col-span-1 border-none shadow-md lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-default-900">Revenue Trend (Last 12 Months)</h3>
          </CardHeader>
          <CardBody className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rollup.chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--heroui-default-500))", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--heroui-default-500))", fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--heroui-default-100))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--heroui-content1))",
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--heroui-default-200))",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    color: "hsl(var(--heroui-foreground))",
                  }}
                  itemStyle={{ color: "hsl(var(--heroui-foreground))" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="currentColor"
                  className="fill-primary"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Tenant Status */}
        <Card className="col-span-1 border-none shadow-md">
          <CardHeader>
            <h3 className="text-lg font-semibold text-default-900">Tenant Status</h3>
          </CardHeader>
          <CardBody className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tenantStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tenantStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--heroui-content1))",
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--heroui-default-200))",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    color: "hsl(var(--heroui-foreground))",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Tenant Table / List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-default-900">Tenant Details</h2>
        <div className="grid grid-cols-1 gap-4">
          {tenants.map((t) => (
            <div
              key={t.username}
              className="group relative flex flex-col gap-4 rounded-xl border border-default-200 bg-content1 p-5 transition-all hover:border-primary-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="truncate text-lg font-bold text-default-900">
                    {t.name}
                  </h3>
                  <Chip size="sm" variant="dot" color={getPaidChipColor(t.derivedIsPaid)}>
                    {t.derivedIsPaid === true ? "Active" : "Issue"}
                  </Chip>
                </div>
                <div className="text-sm text-default-500">@{t.username}</div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-default-500">
                  <span className="rounded-md bg-default-100 px-2 py-1">
                    Plan: {t.planKey}
                  </span>
                  <span className="rounded-md bg-default-100 px-2 py-1">
                    Cadence: {t.cadence}
                  </span>
                </div>
              </div>

              <div className="flex flex-shrink-0 flex-col gap-3 sm:items-end">
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs uppercase text-default-500">Open Balance</div>
                    <div className={`text-lg font-bold ${Object.keys(t.amountOwed).length ? 'text-danger-600' : 'text-default-900'}`}>
                      {formatAmountByCurrency(t.amountOwed)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-default-500">Total Paid</div>
                    <div className="text-lg font-bold text-success-600">
                      {formatAmountByCurrency(t.totalPaid)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-default-400">
                  <span>Last Paid: {formatDate(t.lastPaidAt)}</span>
                  <span>•</span>
                  <span>Next: {formatDate(t.nextBillAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
