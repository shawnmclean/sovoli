"use client";
import { useProgramCycleSelection } from "../../../context/ProgramCycleSelectionContext";
import { Button } from "@sovoli/ui/components/button";
import { Skeleton } from "@sovoli/ui/components/skeleton";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { ProgramCycle } from "~/modules/academics/types";
import { ProgramPriceCard } from "~/app/(tenants)/w/[username]/(main-layout)/programs/components/ProgramPriceCard";
import type { PricingItem } from "~/modules/core/economics/types";
import { formatCycleLabel } from "~/utils/dateUtils";

export interface PriceButtonProps {
  defaultCycle?: ProgramCycle;
}

export function PriceButton({ defaultCycle }: PriceButtonProps) {
  const { selectedCycle, isLoading, isInitialized } =
    useProgramCycleSelection();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Use selected cycle if available, otherwise fall back to default cycle
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

  // Get tuition pricing
  const pricingItem = cycleToUse.pricingPackage.pricingItems.find(
    (item) => item.purpose === "tuition",
  );
  const tuitionCost = pricingItem?.amount.GYD ?? 0;

  // Format billing cycle unit
  const formatBillingCycle = (cycle: string) => {
    if (cycle === "one-time") return "one-time •";
    if (cycle === "annual") return "yearly •";
    if (cycle === "term") return "termly •";
    if (cycle === "monthly") return "monthly •";
    return ``;
  };

  const billingUnit = pricingItem?.billingCycle
    ? formatBillingCycle(pricingItem.billingCycle)
    : "";

  return (
    <>
      <Skeleton isLoaded={!(isLoading && isInitialized)}>
        {selectedCycle ? (
          <Button
            variant="light"
            color="default"
            className="min-h-[4rem] h-auto"
            onPress={onOpen}
          >
            {selectedCycle.status === "closed" ? (
              <span className="text-default-600">Closed</span>
            ) : (
              <div className="flex flex-col items-start min-w-0 w-full">
                <span className="text-md font-bold text-primary underline">
                  GYD {tuitionCost.toLocaleString()}
                </span>
                <span className="text-xs text-foreground-500">
                  {billingUnit} {cycleLabel}
                </span>
              </div>
            )}
          </Button>
        ) : (
          <span className="text-default-600">Closed</span>
        )}
      </Skeleton>

      {/* Price Details Drawer */}
      <Drawer
        isOpen={isOpen}
        size="5xl"
        placement="bottom"
        backdrop="opaque"
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
              },
            },
            exit: {
              y: 100,
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            },
          },
        }}
      >
        <DrawerContent>
          <DrawerBody className="mt-4">
            <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {cycleToUse.pricingPackage.pricingItems
                  .filter((item: PricingItem) => item.purpose === "tuition")
                  .map((item: PricingItem) => (
                    <div key={item.id} className="space-y-2">
                      <ProgramPriceCard
                        pricingPackage={cycleToUse.pricingPackage}
                        pricingItemId={item.id}
                      />
                    </div>
                  ))}

                {cycleToUse.pricingPackage.pricingItems
                  .filter(
                    (item: PricingItem) => item.purpose === "registration",
                  )
                  .map((item: PricingItem) => (
                    <div key={item.id} className="space-y-2">
                      <ProgramPriceCard
                        pricingPackage={cycleToUse.pricingPackage}
                        pricingItemId={item.id}
                      />
                      <p className="text-sm text-foreground-500">
                        {item.purpose}
                      </p>
                    </div>
                  ))}

                {cycleToUse.pricingPackage.pricingItems
                  .filter((item: PricingItem) => item.purpose === "materials")
                  .map((item: PricingItem) => (
                    <div key={item.id} className="space-y-2">
                      <ProgramPriceCard
                        pricingPackage={cycleToUse.pricingPackage}
                        pricingItemId={item.id}
                      />
                      <p className="text-sm text-foreground-500">
                        Purpose: {item.purpose}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
