import { notFound } from "next/navigation";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";

import type { BillingInvoice, BillingPayment } from "~/modules/billing/types";
import type {
  AmountByCurrency,
  CurrencyCode,
  Discount,
  PricingItem,
} from "~/modules/core/economics/types";
import type { PlanDefinition, PlanKey } from "~/modules/plans/types";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { plans } from "~/modules/plans/data";
import { bus } from "~/services/core/bus";

const retrieveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

function parseIsoDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(value?: string): string {
  const d = parseIsoDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getDiscountedAmountUsd(
  item: PricingItem,
  discounts: Discount[] | undefined,
): number {
  const base = item.amount.USD ?? 0;
  const now = new Date().toISOString();
  const activeDiscount = discounts?.find(
    (d) =>
      d.type === "percentage" &&
      d.appliesTo.includes(item.id) &&
      (!d.validFrom || d.validFrom <= now) &&
      (!d.validUntil || d.validUntil >= now),
  );

  if (!activeDiscount) return base;
  return base * (1 - activeDiscount.value / 100);
}

function currency(value: number, code: CurrencyCode = "USD") {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function amountUsd(amount?: AmountByCurrency): number {
  return amount?.USD ?? 0;
}

function getInvoiceStatusColor(status: BillingInvoice["status"]) {
  switch (status) {
    case "paid":
      return "success" as const;
    case "open":
      return "warning" as const;
    case "draft":
      return "default" as const;
    case "void":
    case "uncollectible":
    case "refunded":
      return "danger" as const;
  }
}

function getPaymentStatusColor(status: BillingPayment["status"]) {
  switch (status) {
    case "succeeded":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "failed":
    case "refunded":
      return "danger" as const;
  }
}

function resolvePlan(planKey?: PlanKey): PlanDefinition | null {
  if (planKey) {
    const found = plans.find((p) => p.key === planKey);
    if (found) return found;
  }
  return plans[0] ?? null;
}

function isAdditionalProgramsPricingItemId(pricingItemId: string): boolean {
  return pricingItemId.includes("additional-programs");
}

export default async function BillingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const subscription = orgInstance.billingModule?.subscription;
  const invoices = orgInstance.billingModule?.invoices ?? [];
  const payments = orgInstance.billingModule?.payments ?? [];

  const cadence = subscription?.cadence ?? "monthly";
  const plan = resolvePlan(subscription?.planKey);

  const activeProgramsCount =
    orgInstance.academicModule?.programs.filter((p) => p.isActive !== false)
      .length ?? 0;
  const includedPrograms = 2;
  const additionalPrograms = Math.max(
    0,
    activeProgramsCount - includedPrograms,
  );

  const pricingItems = plan?.pricingPackage.pricingItems ?? [];
  const discounts = plan?.pricingPackage.discounts ?? [];

  const baseItem =
    pricingItems.find(
      (item) => !item.optional && item.billingCycle === cadence,
    ) ?? null;

  const additionalProgramsItem =
    pricingItems.find(
      (item) =>
        item.optional &&
        item.isQuantityBased &&
        item.billingCycle === cadence &&
        item.id.includes("additional-programs"),
    ) ?? null;

  const baseUsd = baseItem ? getDiscountedAmountUsd(baseItem, discounts) : 0;

  const addOnsSelections = subscription?.addOns ?? [];

  const additionalProgramsPerUnitUsd = additionalProgramsItem
    ? getDiscountedAmountUsd(additionalProgramsItem, discounts)
    : 0;

  const derivedAdditionalProgramsUsd =
    additionalProgramsItem && additionalPrograms > 0
      ? additionalProgramsPerUnitUsd * additionalPrograms
      : 0;

  const activeInvoice =
    invoices
      .filter((inv) => inv.status === "open" || inv.status === "draft")
      .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))[0] ?? null;

  const pastInvoices = invoices
    .filter((inv) => inv.status !== "open" && inv.status !== "draft")
    .slice()
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));

  const nowIso = new Date().toISOString();
  const derivedIsPaid =
    subscription?.isPaid ??
    (subscription?.paidThrough
      ? subscription.paidThrough >= nowIso
      : undefined);

  const paidStatusLabel =
    derivedIsPaid === true
      ? "Paid"
      : derivedIsPaid === false
        ? "Not paid"
        : "Unknown";

  const paidStatusColor =
    derivedIsPaid === true
      ? ("success" as const)
      : derivedIsPaid === false
        ? ("danger" as const)
        : ("default" as const);

  const invoicePreviewLineItems = [
    ...(baseItem
      ? [
          {
            pricingItemId: baseItem.id,
            label: baseItem.label,
            quantity: 1,
            unitUsd: baseUsd,
            lineUsd: baseUsd,
          },
        ]
      : []),
    ...(additionalProgramsItem
      ? [
          {
            pricingItemId: additionalProgramsItem.id,
            label: additionalProgramsItem.label,
            quantity: additionalPrograms,
            unitUsd: additionalProgramsPerUnitUsd,
            lineUsd: derivedAdditionalProgramsUsd,
          },
        ]
      : []),
    ...addOnsSelections
      .filter((s) => !isAdditionalProgramsPricingItemId(s.pricingItemId))
      .map((s) => {
        const item = pricingItems.find((i) => i.id === s.pricingItemId);
        const unitUsd = item ? getDiscountedAmountUsd(item, discounts) : 0;
        const quantity = s.quantity ?? 1;
        return {
          pricingItemId: s.pricingItemId,
          label: item?.label ?? s.pricingItemId,
          quantity,
          unitUsd,
          lineUsd: unitUsd * quantity,
        };
      }),
  ].filter((li) => li.quantity > 0);

  const invoicePreviewTotalUsd = invoicePreviewLineItems.reduce(
    (sum, li) => sum + li.lineUsd,
    0,
  );

  const nonProgramAddOns = addOnsSelections.filter(
    (s) => !isAdditionalProgramsPricingItemId(s.pricingItemId),
  );

  const invoicePreviewSummary = [
    baseItem?.label ?? null,
    additionalProgramsItem ? `${additionalPrograms} additional programs` : null,
    nonProgramAddOns.length > 0
      ? `${nonProgramAddOns.length} add-on${nonProgramAddOns.length === 1 ? "" : "s"}`
      : null,
  ]
    .filter((x): x is string => Boolean(x))
    .join(" • ");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-default-500">
          Track subscription, invoices, and payments tied to your plan.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {plan && (
              <Chip color="secondary" variant="flat">
                {plan.title}
              </Chip>
            )}
            <Chip color="primary" variant="flat">
              {cadence === "annual" ? "Yearly" : "Monthly"}
            </Chip>
            <Chip color={paidStatusColor} variant="flat">
              {paidStatusLabel}
            </Chip>
            {!orgInstance.billingModule && (
              <Chip color="warning" variant="flat">
                Not configured (missing billing.json)
              </Chip>
            )}
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                Last paid
              </div>
              <div className="text-default-900 font-semibold">
                {formatDate(subscription?.lastPaidAt)}
              </div>
            </div>
            <div>
              <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                Paid through
              </div>
              <div className="text-default-900 font-semibold">
                {formatDate(subscription?.paidThrough)}
              </div>
            </div>
            <div>
              <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                Next bill
              </div>
              <div className="text-default-900 font-semibold">
                {formatDate(subscription?.nextBillAt)}
              </div>
            </div>
          </div>

          {additionalProgramsItem && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                  Active programs
                </div>
                <div className="text-default-900 font-semibold">
                  {activeProgramsCount}
                </div>
              </div>
              <div>
                <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                  Included programs
                </div>
                <div className="text-default-900 font-semibold">
                  {includedPrograms}
                </div>
              </div>
              <div>
                <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                  Additional programs
                </div>
                <div className="text-default-900 font-semibold">
                  {additionalPrograms}
                </div>
              </div>
            </div>
          )}

          <div className="border-default-200 rounded-lg border p-4">
            <div className="flex flex-col gap-2">
              <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                Current invoice (preview)
              </div>
              <div className="text-default-900 text-2xl font-bold">
                {currency(invoicePreviewTotalUsd)}
              </div>
              {activeInvoice && (
                <div className="space-y-2">
                  <div className="text-default-600 text-sm">
                    Active invoice:{" "}
                    <span className="text-default-900 font-semibold">
                      {activeInvoice.id}
                    </span>{" "}
                    <span className="text-default-500">•</span>{" "}
                    <span className="text-default-900 font-semibold">
                      {activeInvoice.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm text-default-600 sm:grid-cols-2">
                    <div>
                      <span className="text-default-500 text-xs font-medium tracking-wider uppercase">
                        Issued
                      </span>
                      <div className="text-default-900 font-semibold">
                        {formatDate(activeInvoice.issuedAt)}
                      </div>
                    </div>
                    <div>
                      <span className="text-default-500 text-xs font-medium tracking-wider uppercase">
                        Due
                      </span>
                      <div className="text-default-900 font-semibold">
                        {formatDate(activeInvoice.dueAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {invoicePreviewLineItems.length === 0 ? (
                <div className="text-default-600 text-sm">
                  Missing plan pricing items for this cadence.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-default-600 text-sm">
                    {invoicePreviewSummary || "—"}
                  </div>
                  <div className="space-y-1 text-sm">
                    {invoicePreviewLineItems.map((li) => (
                      <div
                        key={li.pricingItemId}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="text-default-900 font-medium truncate">
                            {li.label}
                          </div>
                          <div className="text-default-500 text-xs truncate">
                            {li.pricingItemId}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-default-900 font-semibold">
                            {currency(li.lineUsd)}
                          </div>
                          <div className="text-default-500 text-xs">
                            {li.quantity} × {currency(li.unitUsd)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-col items-start gap-1">
          <h2 className="text-xl font-semibold">Past invoices</h2>
          <p className="text-default-500 text-sm">
            Closed invoices only (paid/void/refunded). The active invoice is shown above.
          </p>
        </CardHeader>
        <CardBody className="space-y-3">
          {pastInvoices.length === 0 ? (
            <div className="text-default-600 text-sm">
              No past invoices yet.
            </div>
          ) : (
            <Accordion variant="splitted">
              {pastInvoices.map((inv) => (
                <AccordionItem
                  key={inv.id}
                  aria-label={inv.id}
                  title={
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-default-900 font-semibold">
                          {inv.id}
                        </span>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getInvoiceStatusColor(inv.status)}
                        >
                          {inv.status}
                        </Chip>
                      </div>
                      <span className="text-default-900 font-semibold">
                        {currency(amountUsd(inv.total))}
                      </span>
                    </div>
                  }
                >
                  {(() => {
                    const invoicePayments =
                      inv.payments ??
                      payments.filter((p) => p.invoiceId === inv.id);

                    const paidTotalUsd = invoicePayments
                      .filter((p) => p.status === "succeeded")
                      .reduce((sum, p) => sum + amountUsd(p.amount), 0);
                    const invoiceTotalUsd = amountUsd(inv.total);
                    const remainingUsd = Math.max(0, invoiceTotalUsd - paidTotalUsd);

                    return (
                      <div className="space-y-4">
                        <div className="text-default-600 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                          <div>
                            <span className="text-default-500 text-xs font-medium tracking-wider uppercase">
                              Issued
                            </span>
                            <div className="text-default-900 font-semibold">
                              {formatDate(inv.issuedAt)}
                            </div>
                          </div>
                          <div>
                            <span className="text-default-500 text-xs font-medium tracking-wider uppercase">
                              Due
                            </span>
                            <div className="text-default-900 font-semibold">
                              {formatDate(inv.dueAt)}
                            </div>
                          </div>
                          <div>
                            <span className="text-default-500 text-xs font-medium tracking-wider uppercase">
                              Paid
                            </span>
                            <div className="text-default-900 font-semibold">
                              {formatDate(inv.paidAt)}
                            </div>
                          </div>
                        </div>

                        {inv.lineItems && inv.lineItems.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                              Line items
                            </div>
                            <div className="space-y-1 text-sm">
                              {inv.lineItems.map((li, idx) => {
                                const quantity = li.quantity ?? 1;
                                const unitUsd =
                                  amountUsd(li.unitAmount) ||
                                  (() => {
                                    const item = pricingItems.find(
                                      (i) => i.id === li.pricingItemId,
                                    );
                                    return item
                                      ? getDiscountedAmountUsd(item, discounts)
                                      : 0;
                                  })();
                                const lineUsd =
                                  amountUsd(li.lineAmount) || unitUsd * quantity;

                                return (
                                  <div
                                    key={`${li.pricingItemId}-${idx}`}
                                    className="flex items-center justify-between gap-4"
                                  >
                                    <div className="min-w-0">
                                      <div className="text-default-900 font-medium truncate">
                                        {li.label ?? li.pricingItemId}
                                      </div>
                                      <div className="text-default-500 text-xs truncate">
                                        {li.pricingItemId}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-default-900 font-semibold">
                                        {currency(lineUsd)}
                                      </div>
                                      <div className="text-default-500 text-xs">
                                        {quantity} × {currency(unitUsd)}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="text-default-500 text-xs font-medium tracking-wider uppercase">
                            Payments
                          </div>
                          {invoicePayments.length === 0 ? (
                            <div className="text-default-600 text-sm">
                              No payments recorded for this invoice.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {invoicePayments
                                .slice()
                                .sort((a, b) => b.paidAt.localeCompare(a.paidAt))
                                .map((p) => (
                                  <div
                                    key={p.id}
                                    className="border-default-200 rounded-lg border px-3 py-2"
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="text-default-900 font-semibold">
                                        {p.id}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Chip
                                          size="sm"
                                          variant="flat"
                                          color={getPaymentStatusColor(p.status)}
                                        >
                                          {p.status}
                                        </Chip>
                                        <Chip size="sm" variant="flat" color="default">
                                          {p.method}
                                        </Chip>
                                        <div className="text-default-900 font-semibold">
                                          {currency(amountUsd(p.amount))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-default-600 mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                                      <div>
                                        <span className="text-default-500 text-xs font-medium tracking-wider uppercase">
                                          Paid at
                                        </span>
                                        <div className="text-default-900 font-semibold">
                                          {formatDate(p.paidAt)}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-default-500 text-xs font-medium tracking-wider uppercase">
                                          Reference
                                        </span>
                                        <div className="text-default-900 font-semibold">
                                          {p.reference ?? "—"}
                                        </div>
                                      </div>
                                  <div />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                            <div className="text-default-600">
                              Paid:{" "}
                              <span className="text-default-900 font-semibold">
                                {currency(paidTotalUsd)}
                              </span>
                            </div>
                            <div className="text-default-600">
                              Remaining:{" "}
                              <span className="text-default-900 font-semibold">
                                {currency(remainingUsd)}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
