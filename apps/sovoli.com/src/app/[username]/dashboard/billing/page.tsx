import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";
import {
  Clock,
  FileText,
  AlertCircle,
  Package,
  CalendarDays,
  ShieldCheck,
  Banknote,
} from "lucide-react";

import type { BillingInvoice } from "~/modules/billing/types";
import type {
  AmountByCurrency,
  CurrencyCode,
  Discount,
  PricingItem,
} from "~/modules/core/economics/types";
import type { PlanDefinition, PlanKey } from "~/modules/plans/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import type { GetOrgInstanceByUsernameResult } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { plans } from "~/modules/plans/data";
import { bus } from "~/services/core/bus";
import { InvoiceHistoryAccordion } from "./components/InvoiceHistoryAccordion";

const retrieveOrgInstance = async (username: string): Promise<OrgInstance> => {
  const result: GetOrgInstanceByUsernameResult =
    await bus.queryProcessor.execute(
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
    day: "numeric",
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
  // Next can pass `params` as a Promise in newer versions; `await` also works
  // if it's already a plain object.
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const subscription = orgInstance.billingModule?.subscription;
  const invoices = orgInstance.billingModule?.invoices ?? [];
  const _payments = orgInstance.billingModule?.payments ?? [];

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

  const activeInvoice: BillingInvoice | null =
    invoices
      .filter((inv) => inv.status === "open" || inv.status === "draft")
      .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))[0] ?? null;

  const pastInvoices: BillingInvoice[] = invoices
    .filter(
      (inv) =>
        inv?.id &&
        typeof inv.id === "string" &&
        inv.status !== "open" &&
        inv.status !== "draft",
    )
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
      ? "Active"
      : derivedIsPaid === false
        ? "Past Due"
        : "Unknown";

  const paidStatusColor =
    derivedIsPaid === true
      ? ("success" as const)
      : derivedIsPaid === false
        ? ("danger" as const)
        : ("default" as const);

  interface InvoicePreviewLineItem {
    pricingItemId: string;
    label: string;
    quantity: number;
    unitUsd: number;
    lineUsd: number;
  }

  const invoicePreviewLineItems: InvoicePreviewLineItem[] = [
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

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Billing & Subscription
        </h1>
        <p className="text-default-500 text-lg">
          Manage your subscription plan, view usage, and access invoice history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Subscription & Usage */}
        <div className="space-y-8 lg:col-span-2">
          {/* Current Plan Card */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-default-100 pb-4">
              <div className="flex w-full items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-default-900">
                      Current Plan
                    </h2>
                    <p className="text-small text-default-500">
                      {plan?.title ?? "Standard Plan"}
                    </p>
                  </div>
                </div>
                <Chip
                  color={paidStatusColor}
                  variant="flat"
                  className="capitalize"
                >
                  {paidStatusLabel}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="gap-6 pt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-default-500">
                    Billing Period
                  </span>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-default-400" />
                    <span className="font-semibold text-default-900 capitalize">
                      {cadence}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-default-500">
                    Next Payment
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-default-400" />
                    <span className="font-semibold text-default-900">
                      {formatDate(subscription?.nextBillAt)}
                    </span>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold text-default-900">
                    {currency(invoicePreviewTotalUsd)}
                  </div>
                  <div className="text-xs text-default-500">
                    Estimated upcoming total
                  </div>
                </div>
                {/* Placeholder for 'Manage Subscription' or similar action if needed */}
              </div>
            </CardBody>
          </Card>

          {/* Usage & Limits */}
          {additionalProgramsItem && (
            <Card className="shadow-sm">
              <CardHeader className="border-b border-default-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                    <Package className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-default-900">
                      Usage & Add-ons
                    </h2>
                    <p className="text-small text-default-500">
                      Track your active programs.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="gap-4 pt-4">
                <div className="flex flex-wrap items-center gap-4 rounded-lg bg-default-50 p-3 sm:gap-8">
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-default-500">
                      Active
                    </div>
                    <div className="text-lg font-bold text-default-900">
                      {activeProgramsCount}
                    </div>
                  </div>
                  <div className="hidden h-8 w-px bg-default-200 sm:block"></div>
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-default-500">
                      Included
                    </div>
                    <div className="text-lg font-bold text-default-900">
                      {includedPrograms}
                    </div>
                  </div>
                  <div className="hidden h-8 w-px bg-default-200 sm:block"></div>
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-default-500">
                      Additional
                    </div>
                    <div className="flex items-baseline gap-1">
                      <div className="text-lg font-bold text-default-900">
                        {additionalPrograms}
                      </div>
                      {additionalPrograms > 0 && (
                        <span className="text-[10px] text-default-500">
                          ({currency(derivedAdditionalProgramsUsd)}/
                          {cadence === "annual" ? "yr" : "mo"})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="rounded-lg border border-default-200">
                  <div className="bg-default-50 px-3 py-1.5 text-[10px] font-medium uppercase text-default-500">
                    Upcoming Invoice Details
                  </div>
                  <div className="divide-y divide-default-100 p-0">
                    {invoicePreviewLineItems.map((li) => (
                      <div
                        key={li.pricingItemId}
                        className="flex items-center justify-between px-3 py-2"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-default-900">
                            {li.label}
                          </span>
                          <span className="text-[10px] text-default-500">
                            Qty: {li.quantity} × {currency(li.unitUsd)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-default-900">
                          {currency(li.lineUsd)}
                        </span>
                      </div>
                    ))}
                    {invoicePreviewLineItems.length === 0 && (
                      <div className="px-3 py-2 text-xs text-default-500">
                        No active line items.
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between border-t border-default-100 bg-default-50/50 px-3 py-2">
                    <span className="text-sm font-bold text-default-900">
                      Total
                    </span>
                    <span className="text-sm font-bold text-default-900">
                      {currency(invoicePreviewTotalUsd)}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right Column: Invoices & History */}
        <div className="space-y-8">
          {/* Active Invoice Alert if any */}
          {activeInvoice && (
            <Card className="border-warning-200 bg-warning-50 shadow-sm">
              <CardBody className="flex flex-row items-start gap-4 p-4">
                <AlertCircle className="mt-1 h-5 w-5 text-warning-600" />
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-warning-900">
                    Invoice Due
                  </h3>
                  <p className="text-sm text-warning-800">
                    Invoice{" "}
                    <span className="font-mono font-medium">
                      {activeInvoice.id}
                    </span>{" "}
                    is {activeInvoice.status}.
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-sm font-medium text-warning-900">
                    <span>Due: {formatDate(activeInvoice.dueAt)}</span>
                    <span>{currency(amountUsd(activeInvoice.total))}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          <Card className="shadow-sm">
            <CardHeader className="border-b border-default-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-default-100">
                  <FileText className="h-5 w-5 text-default-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-default-900">
                    Invoice History
                  </h2>
                  <p className="text-small text-default-500">
                    Recent billing activity.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <InvoiceHistoryAccordion invoices={pastInvoices} />
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b border-default-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-default-100">
                  <Banknote className="h-5 w-5 text-default-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-default-900">
                    Payment Methods
                  </h2>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-center justify-between rounded-lg border border-default-200 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-10 items-center justify-center rounded bg-success-50">
                    <Banknote className="h-4 w-6 text-success-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-default-900">
                      Cash
                    </span>
                    <span className="text-xs text-default-500">
                      Pay directly
                    </span>
                  </div>
                </div>
                <Chip size="sm" variant="flat" color="success">
                  Active
                </Chip>
              </div>
              <div className="mt-4">
                <p className="text-xs text-default-400">
                  We currently only accept cash payments. Online payment methods
                  coming soon.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
