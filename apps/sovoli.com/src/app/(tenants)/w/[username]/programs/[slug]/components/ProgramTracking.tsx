"use client";

import { useCallback, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { useProgramCycleSelection } from "../context/ProgramCycleSelectionContext";

import type { ProgramCycle, Program } from "~/modules/academics/types";

interface ProgramTrackingProps {
  program: Program;
  defaultCycle?: ProgramCycle | null;
}

interface PricingData {
  total: { amount: number; currency: string }[];
}

// Utility functions for price calculation
const calculatePricingData = (
  pricingItems: ProgramCycle["pricingPackage"]["pricingItems"],
): PricingData => {
  const currencyTotals = new Map<string, number>();

  pricingItems.forEach((item) => {
    Object.entries(item.amount).forEach(([currency, amount]) => {
      if (amount) {
        currencyTotals.set(
          currency,
          (currencyTotals.get(currency) ?? 0) + amount,
        );
      }
    });
  });

  const total = Array.from(currencyTotals.entries()).map(
    ([currency, amount]) => ({
      amount,
      currency,
    }),
  );

  return { total };
};

const getPrimaryCurrency = (pricingData: PricingData): string => {
  if (!pricingData.total.length) return "GYD";

  // Priority: GYD > USD > first available
  const gydItem = pricingData.total.find((item) => item.currency === "GYD");
  if (gydItem) return "GYD";

  const usdItem = pricingData.total.find((item) => item.currency === "USD");
  if (usdItem) return "USD";

  return pricingData.total[0]?.currency ?? "GYD";
};

const getProgramName = (program: Program) => {
  return (
    program.name ?? program.standardProgramVersion?.program.name ?? "Program"
  );
};

const getCycleLabel = (cycle: ProgramCycle) => {
  return (
    cycle.academicCycle.customLabel ??
    cycle.academicCycle.globalCycle?.label ??
    "Academic Term"
  );
};

export function ProgramTracking({
  program,
  defaultCycle,
}: ProgramTrackingProps) {
  const posthog = usePostHog();
  const { selectedCycle } = useProgramCycleSelection();

  // Shared tracking function
  const trackProgramView = useCallback(
    (cycle: ProgramCycle, cycleLabel: string) => {
      const programName = getProgramName(program);
      const pricingData = calculatePricingData(
        cycle.pricingPackage.pricingItems,
      );
      const primaryCurrency = getPrimaryCurrency(pricingData);
      const primaryPricing = pricingData.total.find(
        (item) => item.currency === primaryCurrency,
      );

      posthog.capture("ViewContent", {
        content_category: program.group?.label ?? "Program",
        content_name: `${programName} - ${cycleLabel}`,
        content_type: "product",
        content_ids: [cycle.id],
        value: primaryPricing?.amount ?? 0,
        currency: primaryCurrency,
      });
    },
    [program, posthog],
  );

  // Track initial load with defaults
  useEffect(() => {
    if (!defaultCycle) return;

    const defaultCycleLabel = getCycleLabel(defaultCycle);
    trackProgramView(defaultCycle, defaultCycleLabel);
  }, [defaultCycle, trackProgramView]);

  // Track when selections change from defaults
  useEffect(() => {
    if (!selectedCycle) return;

    const cycleLabel = getCycleLabel(selectedCycle);
    const defaultCycleLabel = defaultCycle
      ? getCycleLabel(defaultCycle)
      : "Academic Term";

    if (cycleLabel !== defaultCycleLabel) {
      trackProgramView(selectedCycle, cycleLabel);
    }
  }, [selectedCycle, defaultCycle, trackProgramView]);

  return null; // This component doesn't render anything
}
