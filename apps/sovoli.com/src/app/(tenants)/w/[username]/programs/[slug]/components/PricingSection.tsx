"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";

import { ProgramPriceCard } from "../../../(main-layout)/programs/components/ProgramPriceCard";
import { useProgramSelection } from "../context/ProgramSelectionContext";
import type { OrgProgramCycle } from "~/modules/academics/types";
import type { PricingItem } from "~/modules/core/economics/types";

interface PricingSectionProps {
  programCycles: OrgProgramCycle[];
  defaultCycle?: OrgProgramCycle;
}

export function PricingSection({
  programCycles,
  defaultCycle,
}: PricingSectionProps) {
  const { selectedCycle, isLoading } = useProgramSelection();

  // Use selected cycle if available, otherwise fall back to default cycle
  const cycleToUse = selectedCycle ?? defaultCycle;

  if (programCycles.length === 0 || isLoading || !cycleToUse) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <h3 className="text-xl font-bold text-foreground">Your Cost</h3>
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
                  <p className="text-sm text-foreground-500">{item.purpose}</p>
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
  );
}
