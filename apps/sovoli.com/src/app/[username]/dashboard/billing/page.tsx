import { notFound } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";
import Link from "next/link";
import {
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Download,
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


// --- Helpers ---

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

function formatDate(value?: string | Date): string {
  if (!value) return "—";
  const d = typeof value === "string" ? parseIsoDate(value) : value;
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function currency(value: number, code: CurrencyCode = "USD") {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function amountUsd(amount?: AmountByCurrency): number {
  return amount?.USD ?? 0;
}

function resolvePlan(planKey?: PlanKey): PlanDefinition | null {
  if (planKey) {
    const found = plans.find((p) => p.key === planKey);
    if (found) return found;
  }
  return plans[0] ?? null;
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

// --- Components ---

function StatusBadge({
  status,
  isPaid,
}: {
  status?: string;
  isPaid?: boolean;
}) {
  if (status === "active" && isPaid) {
    return (
      <Chip color="success" variant="flat" size="sm" className="capitalize">
        Active
      </Chip>
    );
  }
  if (status === "active" && !isPaid) {
    return (
      <Chip color="warning" variant="flat" size="sm" className="capitalize">
        Past Due
      </Chip>
    );
  }
  return (
    <Chip color="default" variant="flat" size="sm" className="capitalize">
      {status ?? "Unknown"}
    </Chip>
  );
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
  const plan = resolvePlan(subscription?.planKey);

  // -- Billing Logic --
  const now = new Date();
  const nextBillingDate =
    subscription?.nextBillAt ?? subscription?.paidThrough;

  // Filter for *Actively Due* invoices only.
  // An invoice is due if it is open/draft AND strictly from the past or today.
  // Future dated 'open' invoices (generated for next cycle) should be ignored.
  const overdueInvoices = invoices.filter((inv) => {
    const isUnpaid = inv.status === "open" || inv.status === "draft";
    const issueDate = parseIsoDate(inv.issuedAt);
    const isIssued = issueDate ? issueDate <= now : false;
    return isUnpaid && isIssued;
  });

  const activeAlertInvoice = overdueInvoices[0];

  const pastInvoices = invoices
    .filter((inv) => !overdueInvoices.includes(inv))
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));

  // -- Cost Estimation --
  // Reuse logic to estimate next bill amount
  const cadence = subscription?.cadence ?? "monthly";
  const pricingItems = plan?.pricingPackage.pricingItems ?? [];
  const discounts = plan?.pricingPackage.discounts ?? [];

  const activeProgramsCount =
    orgInstance.academicModule?.programs.filter((p) => p.isActive !== false)
      .length ?? 0;
  const includedPrograms = 2; // Hardcoded in original, keeping consistent
  const additionalPrograms = Math.max(0, activeProgramsCount - includedPrograms);

  const baseItem = pricingItems.find(
    (item) => !item.optional && item.billingCycle === cadence,
  );

  // Assuming ID convention from original file
  const additionalProgramsItem = pricingItems.find(
    (item) =>
      item.optional &&
      item.isQuantityBased &&
      item.billingCycle === cadence &&
      item.id.includes("additional-programs"),
  );

  const baseUsd = baseItem ? getDiscountedAmountUsd(baseItem, discounts) : 0;
  const additionalProgramsPerUnitUsd = additionalProgramsItem
    ? getDiscountedAmountUsd(additionalProgramsItem, discounts)
    : 0;

  const estimatedTotal =
    baseUsd + (additionalPrograms * additionalProgramsPerUnitUsd);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-default-900">Billing</h1>
        <p className="text-default-500">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Alert for Overdue Invoice */}
      {activeAlertInvoice && (
        <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-danger-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-danger-900">
              Payment Overdue
            </h3>
            <p className="text-sm text-danger-700 mt-1">
              There is an outstanding invoice of{" "}
              <span className="font-bold">
                {currency(amountUsd(activeAlertInvoice.total))}
              </span>{" "}
              due on {formatDate(activeAlertInvoice.dueAt)}.
            </p>
            <div className="mt-3">
              <Link
                href={`/${username}/dashboard/billing/invoices/${activeAlertInvoice.id}`}
              >
                <Button size="sm" color="danger" variant="flat">
                  Review Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content: Plan & Subscription */}
        <div className="md:col-span-2 space-y-6">

          {/* Plan Details Card */}
          <Card className="shadow-sm border border-default-200">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0 pt-6 px-6">
              <div>
                <h2 className="text-lg font-semibold text-default-900">
                  {plan?.title ?? "Standard Plan"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-default-500">
                    {cadence === "monthly" ? "Monthly billing" : "Annual billing"}
                  </span>
                  <StatusBadge
                    status={subscription?.status}
                    isPaid={subscription?.isPaid}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-default-900">
                  {currency(estimatedTotal)}
                  <span className="text-sm font-normal text-default-500 ml-1">
                    /{cadence === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-default-50 rounded-lg border border-default-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-default-500 block mb-1">
                    Current Usage
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-default-900">
                      <span className="font-semibold">{activeProgramsCount}</span> Active Programs
                    </span>
                  </div>
                  <p className="text-xs text-default-400 mt-1">
                    {includedPrograms} included in base plan
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-default-500 block mb-1">
                    Next Invoice
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-default-400" />
                    <span className="text-sm font-medium text-default-900">
                      {formatDate(nextBillingDate)}
                    </span>
                  </div>
                  <p className="text-xs text-default-400 mt-1">
                    Estimated amount: {currency(estimatedTotal)}
                  </p>
                </div>
              </div>

              {/* Line Items Breakdown (Simplified) */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-default-600">{plan?.title} (Base)</span>
                  <span className="text-default-900 font-medium">{currency(baseUsd)}</span>
                </div>
                {additionalPrograms > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-default-600">
                      {additionalPrograms} Additional {additionalPrograms === 1 ? 'Program' : 'Programs'}
                    </span>
                    <span className="text-default-900 font-medium">
                      {currency(additionalPrograms * additionalProgramsPerUnitUsd)}
                    </span>
                  </div>
                )}
                <Divider className="my-2" />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Current Usage</span>
                  <span>{currency(estimatedTotal)}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Invoice History */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-default-900 mb-4">Invoice History</h3>
            <div className="rounded-lg border border-default-200 bg-content1 overflow-hidden divide-y divide-default-100">
              {pastInvoices.length > 0 ? (
                pastInvoices.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/${username}/dashboard/billing/invoices/${inv.id}`}
                    className="block hover:bg-default-50 transition-colors"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-default-100 text-default-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-default-900 text-sm">
                              {formatDate(inv.issuedAt)}
                            </span>
                            <span className="text-xs text-default-400">
                              #{inv.invoiceNumber || inv.id.slice(-6)}
                            </span>
                          </div>
                          <div className="sm:hidden text-xs text-default-500 mt-0.5">
                            {currency(amountUsd(inv.total))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:block font-medium text-sm text-default-900">
                          {currency(amountUsd(inv.total))}
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={inv.status === 'paid' ? 'success' : inv.status === 'open' ? 'warning' : 'default'}
                          className="capitalize"
                        >
                          {inv.status}
                        </Chip>
                        <ChevronRight className="h-4 w-4 text-default-300" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-default-500">
                  No invoices found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Payment Method & Support */}
        <div className="space-y-6">
          {/* Payment Method */}
          <Card className="shadow-sm border border-default-200">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-default-500">Payment Method</h3>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-default-200 bg-default-50">
                <div className="h-8 w-12 bg-content1 rounded border border-default-200 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-default-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-default-900">Cash / Manual</p>
                  <p className="text-xs text-default-500">•••• •••• •••• ••••</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-default-400">
                Online payments support coming soon. Please <a href="mailto:hi@sovoli.com" className="text-primary-600 hover:underline">contact support</a> for billing questions.
              </div>
            </CardBody>
          </Card>

          {/* Support / Help */}
          <div className="rounded-lg bg-primary-50 p-4 border border-primary-100">
            <h4 className="font-semibold text-primary-700 text-sm mb-1">Need help with billing?</h4>
            <p className="text-xs text-primary-600 mb-3">
              Contact our support team for any questions regarding your invoices or plan.
            </p>
            <a href="mailto:hi@sovoli.com" className="w-full block">
              <Button size="sm" color="primary" variant="flat" className="w-full">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
