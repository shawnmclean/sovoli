"use client";
import { useProgramCycleSelection } from "../../../context/ProgramCycleSelectionContext";
import { Button } from "@sovoli/ui/components/button";
import { Skeleton } from "@sovoli/ui/components/skeleton";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { formatCycleLabel } from "~/utils/dateUtils";
import Link from "next/link";

export interface PriceButtonProps {
  defaultCycle?: ProgramCycle;
  program?: Program;
}

export function PriceButton({ defaultCycle, program }: PriceButtonProps) {
  const { selectedCycle, isLoading, isInitialized } =
    useProgramCycleSelection();

  // Use selected cycle if available, otherwise fall back to default cycle
  // This ensures the drawer always uses the same cycle as what's displayed in the button
  const cycleToUse = selectedCycle ?? defaultCycle;

  // Only show loading during user-initiated changes, not during initial render
  if ((isLoading && isInitialized) || !cycleToUse) {
    return null;
  }

  const startDate =
    cycleToUse.academicCycle.startDate ??
    cycleToUse.academicCycle.globalCycle?.startDate;
  const endDate =
    cycleToUse.academicCycle.endDate ??
    cycleToUse.academicCycle.globalCycle?.endDate;

  const cycleLabel = formatCycleLabel(startDate, endDate);

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
  const tuitionCost = currencyEntry ? currencyEntry[1] : 0;

  // Format billing cycle unit
  const formatBillingCycle = (cycle: string) => {
    if (cycle === "annual") return "yearly •";
    if (cycle === "term") return "termly •";
    if (cycle === "monthly") return "monthly •";
    return ``;
  };

  const billingUnit = pricingItem?.billingCycle
    ? formatBillingCycle(pricingItem.billingCycle)
    : "";
  const billingLine = [billingUnit, cycleLabel].filter(Boolean).join(" ");

  // Determine if we should show the button as clickable
  // Only show pricing button if we have a cycle and it's not closed
  const showPricingButton = selectedCycle && selectedCycle.status !== "closed";

  if (!program) {
    return null;
  }

  return (
    <Skeleton isLoaded={!(isLoading && isInitialized)}>
      {showPricingButton ? (
        <Button
          as={Link}
          href={`/programs/${program.slug}/price`}
          variant="light"
          color="default"
          className=" h-auto"
        >
          <div className="flex flex-col items-start min-w-0 w-full">
            <span className="text-md font-bold text-primary underline">
              {currency} {tuitionCost.toLocaleString()}
            </span>
            <span className="text-xs text-foreground-500">{billingLine}</span>
          </div>
        </Button>
      ) : (
        <span className="text-default-600">Closed</span>
      )}
    </Skeleton>
  );
}
