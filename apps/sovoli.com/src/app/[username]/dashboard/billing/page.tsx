import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { notFound } from "next/navigation";
import { growthPlan } from "~/modules/plans/data/growth";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import type { CurrencyCode, Discount, PricingItem } from "~/modules/core/economics/types";

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

export default async function BillingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const subscription = orgInstance.billingModule?.subscription;

  const cadence = subscription?.cadence ?? "monthly";

  const activeProgramsCount =
    orgInstance.academicModule?.programs.filter((p) => p.isActive !== false)
      .length ?? 0;
  const includedPrograms = 2;
  const additionalPrograms = Math.max(0, activeProgramsCount - includedPrograms);

  const baseItem =
    growthPlan.pricingPackage.pricingItems.find(
      (item) => !item.optional && item.billingCycle === cadence,
    ) ?? null;

  const additionalProgramsItem =
    growthPlan.pricingPackage.pricingItems.find(
      (item) =>
        item.optional &&
        item.isQuantityBased &&
        item.billingCycle === cadence &&
        item.id.includes("additional-programs"),
    ) ?? null;

  const discounts = growthPlan.pricingPackage.discounts ?? [];

  const baseUsd = baseItem ? getDiscountedAmountUsd(baseItem, discounts) : 0;
  const additionalPerUnitUsd = additionalProgramsItem
    ? getDiscountedAmountUsd(additionalProgramsItem, discounts)
    : 0;

  const expectedUsd = baseUsd + additionalPerUnitUsd * additionalPrograms;

  const nowIso = new Date().toISOString();
  const derivedIsPaid =
    subscription?.isPaid ??
    (subscription?.paidThrough ? subscription.paidThrough >= nowIso : undefined);

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

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-default-500">
          Track subscription cadence, payment status, and what’s included.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
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
              <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
                Last paid
              </div>
              <div className="text-default-900 font-semibold">
                {formatDate(subscription?.lastPaidAt)}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
                Paid through
              </div>
              <div className="text-default-900 font-semibold">
                {formatDate(subscription?.paidThrough)}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
                Next bill
              </div>
              <div className="text-default-900 font-semibold">
                {formatDate(subscription?.nextBillAt)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
                Active programs
              </div>
              <div className="text-default-900 font-semibold">
                {activeProgramsCount}
              </div>
              <div className="text-xs text-default-500">
                Inactive programs are hidden on the public site.
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
                Included programs
              </div>
              <div className="text-default-900 font-semibold">
                {includedPrograms}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
                Additional programs
              </div>
              <div className="text-default-900 font-semibold">
                {additionalPrograms}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-default-200 bg-default-50 p-4">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
                Expected subscription amount (USD)
              </div>
              <div className="text-3xl font-bold text-default-900">
                {currency(expectedUsd)}
                <span className="ml-2 text-sm font-normal text-default-500">
                  {cadence === "annual" ? "/ year" : "/ month"}
                </span>
              </div>

              <div className="text-sm text-default-600">
                {baseItem ? (
                  <div>
                    Base: {currency(baseUsd)}
                    {cadence === "annual" && discounts.length > 0 ? (
                      <span className="text-default-500">
                        {" "}
                        (discounts applied)
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-danger-600">
                    Missing base plan pricing for cadence: {cadence}
                  </div>
                )}

                {additionalProgramsItem ? (
                  <div>
                    Additional programs: {additionalPrograms} ×{" "}
                    {currency(additionalPerUnitUsd)} ={" "}
                    {currency(additionalPerUnitUsd * additionalPrograms)}
                  </div>
                ) : (
                  <div className="text-danger-600">
                    Missing additional-program pricing for cadence: {cadence}
                  </div>
                )}
              </div>
            </div>
          </div>

          {orgInstance.billingModule?.notes && (
            <div className="text-sm text-default-600">
              <span className="font-semibold text-default-700">Notes:</span>{" "}
              {orgInstance.billingModule.notes}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

