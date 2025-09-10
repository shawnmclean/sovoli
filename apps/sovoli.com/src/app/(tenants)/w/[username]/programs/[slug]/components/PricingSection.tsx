"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";

import { ProgramPriceCard } from "../../../(main-layout)/programs/components/ProgramPriceCard";
import { useProgramCycleSelection } from "../context/ProgramCycleSelectionContext";
import type { ProgramCycle } from "~/modules/academics/types";
import type { PricingItem } from "~/modules/core/economics/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import type { Program } from "~/modules/academics/types";

interface PricingSectionProps {
  defaultCycle?: ProgramCycle;
  program: Program;
}

export function PricingSection({ defaultCycle, program }: PricingSectionProps) {
  const { selectedCycle, isLoading, isInitialized } =
    useProgramCycleSelection();

  // Use selected cycle if available, otherwise fall back to default cycle
  const cycleToUse = selectedCycle ?? defaultCycle;

  // Only show loading during user-initiated changes, not during initial render
  if ((isLoading && isInitialized) || !cycleToUse) {
    return null;
  }

  return (
    <ProgramSectionsWrapper
      program={program}
      section="pricing"
      className="hidden md:block"
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <h2 className="text-xl font-bold text-foreground">Your Cost</h2>
        </CardHeader>
        <CardBody className="space-y-6">
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
                .filter((item: PricingItem) => item.purpose === "registration")
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
        </CardBody>
      </Card>
    </ProgramSectionsWrapper>
  );
}
