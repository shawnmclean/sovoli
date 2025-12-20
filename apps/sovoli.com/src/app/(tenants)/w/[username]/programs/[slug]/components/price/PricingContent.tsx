"use client";

import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { ProgramPriceCard } from "~/app/(tenants)/w/[username]/(main-layout)/programs/components/ProgramPriceCard";
import type { PricingItem } from "~/modules/core/economics/types";
import { PaymentPlan } from "../PaymentPlan";

interface PricingContentProps {
  program: Program;
  defaultCycle?: ProgramCycle;
}

export function PricingContent({ defaultCycle }: PricingContentProps) {
  const { selectedCycle } = useProgramCycleSelection();

  // Use selected cycle if available, otherwise fall back to default cycle
  const cycleToUse = selectedCycle ?? defaultCycle;

  if (!cycleToUse) {
    return null;
  }

  const startDate =
    cycleToUse.academicCycle.startDate ??
    cycleToUse.academicCycle.globalCycle?.startDate;

  // Get tuition pricing from the cycle that will be displayed
  const pricingItem = cycleToUse.pricingPackage.pricingItems.find(
    (item) => item.purpose === "tuition",
  );

  // Get the first available currency and amount
  const currencyEntry = pricingItem?.amount
    ? Object.entries(pricingItem.amount).find(
        ([_, amount]) => amount && amount > 0,
      )
    : null;

  const currency = currencyEntry
    ? (currencyEntry[0] as "GYD" | "USD" | "JMD")
    : "GYD";

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-semibold text-foreground">Price details</h2>
      {/* Tuition Section */}
      {cycleToUse.pricingPackage.pricingItems.filter(
        (item: PricingItem) => item.purpose === "tuition",
      ).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wide">
            Tuition
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {cycleToUse.pricingPackage.pricingItems
              .filter((item: PricingItem) => item.purpose === "tuition")
              .map((item: PricingItem) => (
                <ProgramPriceCard
                  key={item.id}
                  pricingPackage={cycleToUse.pricingPackage}
                  pricingItemId={item.id}
                  preferredCurrency={currency}
                />
              ))}
          </div>
        </div>
      )}

      {/* Registration Section */}
      {cycleToUse.pricingPackage.pricingItems.filter(
        (item: PricingItem) => item.purpose === "registration",
      ).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wide">
            Registration
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {cycleToUse.pricingPackage.pricingItems
              .filter((item: PricingItem) => item.purpose === "registration")
              .map((item: PricingItem) => (
                <ProgramPriceCard
                  key={item.id}
                  pricingPackage={cycleToUse.pricingPackage}
                  pricingItemId={item.id}
                  preferredCurrency={currency}
                />
              ))}
          </div>
        </div>
      )}

      {/* Materials Section */}
      {cycleToUse.pricingPackage.pricingItems.filter(
        (item: PricingItem) => item.purpose === "materials",
      ).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wide">
            Materials
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {cycleToUse.pricingPackage.pricingItems
              .filter((item: PricingItem) => item.purpose === "materials")
              .map((item: PricingItem) => (
                <ProgramPriceCard
                  key={item.id}
                  pricingPackage={cycleToUse.pricingPackage}
                  pricingItemId={item.id}
                  preferredCurrency={currency}
                />
              ))}
          </div>
        </div>
      )}

      {/* Payment Plan Section */}
      {cycleToUse.pricingPackage.paymentSplits &&
        cycleToUse.pricingPackage.paymentSplits.length > 0 && (
          <div className="pt-4 border-t border-divider">
            <PaymentPlan
              pricingPackage={cycleToUse.pricingPackage}
              preferredCurrency={currency}
              cycleStartDate={startDate}
            />
          </div>
        )}
    </div>
  );
}
