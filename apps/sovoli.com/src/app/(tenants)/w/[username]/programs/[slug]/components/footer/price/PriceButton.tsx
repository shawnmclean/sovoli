import { useProgramCycleSelection } from "../../../context/ProgramCycleSelectionContext";
import { Button } from "@sovoli/ui/components/button";
import { Skeleton } from "@sovoli/ui/components/skeleton";

export type PriceButtonProps = Record<string, never>;

export function PriceButton(_props: PriceButtonProps) {
  const { selectedCycle, isLoading, isInitialized } =
    useProgramCycleSelection();

  const cycleLabel = selectedCycle
    ? (selectedCycle.academicCycle.customLabel ??
      selectedCycle.academicCycle.globalCycle?.label ??
      "Academic Term")
    : "";

  // Get tuition pricing
  const pricingItem = selectedCycle?.pricingPackage.pricingItems.find(
    (item) => item.purpose === "tuition",
  );
  const tuitionCost = pricingItem?.amount.GYD ?? 0;

  // Format billing cycle unit
  const formatBillingCycle = (cycle: string) => {
    if (cycle === "one-time") return "one-time";
    if (cycle === "annual") return "per year";
    if (cycle === "term") return "per term";
    if (cycle === "monthly") return "per month";
    return `per ${cycle}`;
  };

  const billingUnit = pricingItem?.billingCycle
    ? formatBillingCycle(pricingItem.billingCycle)
    : "";

  return (
    <Skeleton isLoaded={!(isLoading && isInitialized)}>
      {selectedCycle ? (
        <Button
          variant="light"
          color="default"
          className="min-h-[4rem] h-auto py-2"
          onPress={() => {
            // TODO: Implement price button action
          }}
        >
          {selectedCycle.status === "closed" ? (
            <span className="text-default-600">Closed</span>
          ) : (
            <div className="flex flex-col items-start gap-1 min-w-0 w-full">
              <span className="text-md font-bold text-primary">
                GYD {tuitionCost.toLocaleString()}
              </span>
              <span className="text-xs text-foreground-500">{billingUnit}</span>
              <span className="text-xs text-foreground-500">{cycleLabel}</span>
            </div>
          )}
        </Button>
      ) : (
        <span className="text-default-600">Closed</span>
      )}
    </Skeleton>
  );
}
