import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";

import type { BillingInvoice, BillingPayment } from "~/modules/billing/types";
import { ORGS } from "~/modules/data/organisations";

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

export default function AdminBillingPage() {
  const nowIso = new Date().toISOString();

  const tenants = ORGS.filter((o) => o.websiteModule?.website.domain).map(
    (o) => {
      const subscription = o.billingModule?.subscription;
      const derivedIsPaid =
        subscription?.isPaid ??
        (subscription?.paidThrough
          ? subscription.paidThrough >= nowIso
          : undefined);

      return {
        username: o.org.username,
        name: o.org.name,
        planKey: subscription?.planKey ?? "—",
        cadence: subscription?.cadence ?? "—",
        derivedIsPaid,
        lastPaidAt: subscription?.lastPaidAt,
        paidThrough: subscription?.paidThrough,
        nextBillAt: subscription?.nextBillAt,
        openInvoices: countOpenInvoices(o.billingModule?.invoices ?? undefined),
        invoicesCount: o.billingModule?.invoices?.length ?? 0,
        paymentsCount: countPayments(
          o.billingModule?.invoices ?? undefined,
          o.billingModule?.payments ?? undefined,
        ),
      };
    },
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Billing Status</h1>
          <p className="text-default-500 text-sm">
            Scrappy billing ledger overview across tenants (JSON-driven).
          </p>
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

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
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
