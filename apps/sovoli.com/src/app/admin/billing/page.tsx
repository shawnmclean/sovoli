import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";

import type { BillingInvoice, BillingPayment } from "~/modules/billing/types";
import type { AmountByCurrency, CurrencyCode } from "~/modules/core/economics/types";
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

  const entries = (Object.entries(amount) as [CurrencyCode, number | undefined][])
    .filter(([, value]) => typeof value === "number" && value !== 0) as [
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

  const rollup = (() => {
    const paidAllTime: AmountByCurrency = {};
    const paidThisMonth: AmountByCurrency = {};
    const expectedThisMonth: AmountByCurrency = {};
    const expectedNextMonth: AmountByCurrency = {};

    const paymentById = new Map<string, BillingPayment>();

    let paidAllTimeCount = 0;
    let paidThisMonthCount = 0;
    let expectedThisMonthCount = 0;
    let expectedNextMonthCount = 0;

    for (const o of orgsWithInvoices) {
      const invoices = o.billingModule?.invoices ?? [];
      const payments = o.billingModule?.payments ?? [];

      for (const inv of invoices) {
        for (const p of inv.payments ?? []) {
          paymentById.set(p.id, p);
        }

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
        paymentsCount: countPayments(
          invoices,
          modulePayments,
        ),
        amountOwed,
        totalPaid,
      };
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Billing Status</h1>
          <p className="text-default-500 text-sm">
            Scrappy billing ledger overview across tenants (JSON-driven).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-col items-start gap-1">
              <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                Paid (all time)
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-default-900 text-2xl font-bold">
                {formatAmountByCurrency(rollup.paidAllTime)}
              </div>
              <div className="text-default-500 text-sm">
                {rollup.paidAllTimeCount} payment
                {rollup.paidAllTimeCount !== 1 ? "s" : ""}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-start gap-1">
              <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                Paid this month
              </div>
              <Chip size="sm" variant="flat" color="primary">
                {thisMonthLabel}
              </Chip>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-default-900 text-2xl font-bold">
                {formatAmountByCurrency(rollup.paidThisMonth)}
              </div>
              <div className="text-default-500 text-sm">
                {rollup.paidThisMonthCount} payment
                {rollup.paidThisMonthCount !== 1 ? "s" : ""}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-start gap-1">
              <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                Expected this month (open invoices)
              </div>
              <Chip size="sm" variant="flat" color="warning">
                {thisMonthLabel}
              </Chip>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-default-900 text-2xl font-bold">
                {formatAmountByCurrency(rollup.expectedThisMonth)}
              </div>
              <div className="text-default-500 text-sm">
                {rollup.expectedThisMonthCount} invoice
                {rollup.expectedThisMonthCount !== 1 ? "s" : ""}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-start gap-1">
              <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                Expected next month (open invoices)
              </div>
              <Chip size="sm" variant="flat" color="secondary">
                {nextMonthLabel}
              </Chip>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-default-900 text-2xl font-bold">
                {formatAmountByCurrency(rollup.expectedNextMonth)}
              </div>
              <div className="text-default-500 text-sm">
                {rollup.expectedNextMonthCount} invoice
                {rollup.expectedNextMonthCount !== 1 ? "s" : ""}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col items-start gap-1">
            <div className="text-default-500 text-sm">
              {tenants.length} tenant{tenants.length !== 1 ? "s" : ""} shown
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {tenants.map((t) => (
              <div
                key={t.username}
                className="border-default-200 rounded-lg border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-default-900 truncate font-semibold">
                      {t.name}
                    </div>
                    <div className="text-default-500 truncate text-sm">
                      @{t.username}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Chip size="sm" variant="flat" color="secondary">
                      {t.planKey}
                    </Chip>
                    <Chip size="sm" variant="flat" color="primary">
                      {t.cadence}
                    </Chip>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getPaidChipColor(t.derivedIsPaid)}
                    >
                      {t.derivedIsPaid === true
                        ? "Paid"
                        : t.derivedIsPaid === false
                          ? "Not paid"
                          : "Unknown"}
                    </Chip>
                    {t.openInvoices > 0 && (
                      <Chip size="sm" variant="flat" color="warning">
                        {t.openInvoices} open invoice
                        {t.openInvoices !== 1 ? "s" : ""}
                      </Chip>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <div>
                    <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                      Last paid
                    </div>
                    <div className="text-default-900 font-semibold">
                      {formatDate(t.lastPaidAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                      Paid through
                    </div>
                    <div className="text-default-900 font-semibold">
                      {formatDate(t.paidThrough)}
                    </div>
                  </div>
                  <div>
                    <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                      Next bill
                    </div>
                    <div className="text-default-900 font-semibold">
                      {formatDate(t.nextBillAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                      Owed (open balance)
                    </div>
                    <div className="text-default-900 font-semibold">
                      {formatAmountByCurrency(t.amountOwed)}
                    </div>
                  </div>
                  <div>
                    <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                      Paid (all time)
                    </div>
                    <div className="text-default-900 font-semibold">
                      {formatAmountByCurrency(t.totalPaid)}
                    </div>
                  </div>
                  <div>
                    <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                      Ledger entries
                    </div>
                    <div className="text-default-900 font-semibold">
                      {t.invoicesCount} inv • {t.paymentsCount} pay
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
