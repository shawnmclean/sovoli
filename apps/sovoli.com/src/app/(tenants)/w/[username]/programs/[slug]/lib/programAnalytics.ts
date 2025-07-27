import type { ProgramCycle, Program } from "~/modules/academics/types";
import posthog from "posthog-js";

interface PricingData {
  total: { amount: number; currency: string }[];
}

interface ProgramAnalyticsData {
  program: Program;
  cycle?: ProgramCycle | null;
  cycleLabel?: string;
  programName?: string;
  pricingData?: PricingData;
  primaryCurrency?: string;
  primaryPricing?: { amount: number; currency: string };
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

// Centralized analytics data preparation
const prepareProgramAnalytics = (
  program: Program,
  cycle?: ProgramCycle | null,
): ProgramAnalyticsData => {
  const programName = getProgramName(program);
  const cycleLabel = cycle ? getCycleLabel(cycle) : undefined;

  let pricingData: PricingData | undefined;
  let primaryCurrency: string | undefined;
  let primaryPricing: { amount: number; currency: string } | undefined;

  if (cycle) {
    pricingData = calculatePricingData(cycle.pricingPackage.pricingItems);
    primaryCurrency = getPrimaryCurrency(pricingData);
    primaryPricing = pricingData.total.find(
      (item) => item.currency === primaryCurrency,
    );
  }

  return {
    program,
    cycle,
    cycleLabel,
    programName,
    pricingData,
    primaryCurrency,
    primaryPricing,
  };
};

// Single analytics function that components can call
export const trackProgramAnalytics = (
  event: "ViewContent" | "ChatOpened" | "ChatClosed" | "Contact" | "Lead",
  program: Program,
  cycle?: ProgramCycle | null,
  additionalData?: Record<string, unknown>,
) => {
  const analyticsData = prepareProgramAnalytics(program, cycle);
  const programName = analyticsData.programName;
  const cycleLabel = analyticsData.cycleLabel;

  posthog.capture(event, {
    content_category: analyticsData.program.group?.label ?? "Program",
    content_name: `${programName} - ${cycleLabel}`,
    content_type: "product",
    content_ids: [analyticsData.cycle?.id],
    value: analyticsData.primaryPricing?.amount ?? 0,
    currency: analyticsData.primaryCurrency ?? "GYD",
    ...additionalData,
  });
};

// Person properties tracking
export const setPersonProperties = (properties: {
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
}) => {
  posthog.setPersonProperties(properties);
};

// Export utility functions for use in components that need them directly
export {
  getProgramName,
  getCycleLabel,
  calculatePricingData,
  getPrimaryCurrency,
};
