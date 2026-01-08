"use client";

import { useMemo } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";

export interface ROASCalculatorStepProps {
  adSpend: string | null;
  returnValue: number;
  onNext: () => void;
}

const JMD_TO_USD_RATE = 155;
const MIN_ROAS = 6;
const MAX_ROAS = 10;

function parseAdSpend(adSpend: string | null): number | null {
  if (!adSpend) return null;
  if (adSpend === "0") return 0;
  if (adSpend === "100-500") return 300; // Midpoint for calculation
  if (adSpend === "500-1000") return 750; // Midpoint for calculation
  if (adSpend === "1000+") return 1000; // Minimum estimate
  return null;
}

export function ROASCalculatorStep({
  adSpend,
  returnValue,
  onNext,
}: ROASCalculatorStepProps) {
  const roasData = useMemo(() => {
    const adSpendUsd = parseAdSpend(adSpend);
    if (adSpendUsd === null || adSpendUsd === 0 || returnValue === 0) {
      return null;
    }

    const returnUsd = returnValue / JMD_TO_USD_RATE;
    const currentRoas = returnUsd / adSpendUsd;
    
    // Calculate potential returns with our system
    const minPotentialReturn = adSpendUsd * MIN_ROAS;
    const maxPotentialReturn = adSpendUsd * MAX_ROAS;
    const avgPotentialReturn = adSpendUsd * ((MIN_ROAS + MAX_ROAS) / 2);
    
    return {
      adSpendUsd,
      returnUsd,
      currentRoas,
      minPotentialReturn,
      maxPotentialReturn,
      avgPotentialReturn,
    };
  }, [adSpend, returnValue]);

  if (!roasData) {
    // If we can't calculate, just show next button
    return (
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold mb-2">ROAS Calculator</h1>
        </div>
        <Button
          variant="solid"
          color="primary"
          radius="lg"
          fullWidth
          size="lg"
          onPress={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
        >
          Next
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Your Current ROAS</h1>
        <p className="text-default-600 mb-6">
          Based on your previous answers, here's your current return on ad spend.
        </p>
      </div>

      <Card className="p-6 bg-default-50 border-default-200">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-default-600 mb-1">
              Current ROAS
            </div>
            <div className="text-4xl font-bold text-foreground">
              {roasData.currentRoas.toFixed(1)}x
            </div>
            <div className="text-xs text-default-500 mt-1">
              You're making ${roasData.currentRoas.toFixed(2)} for every $1 spent
            </div>
          </div>
        </div>
      </Card>

      <div className="text-left">
        <h2 className="text-2xl font-bold mb-2">What if we could improve that?</h2>
        <p className="text-default-600 mb-6">
          With our system, we've seen businesses achieve 6x-10x ROAS. Here's what that could mean for you:
        </p>
      </div>

      <Card className="p-6 bg-primary/10 border-primary/20">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-default-600 mb-1">
              Potential ROAS with our system
            </div>
            <div className="text-3xl font-bold text-primary">
              {MIN_ROAS}x - {MAX_ROAS}x
            </div>
          </div>
          
          <div className="pt-4 border-t border-default-200">
            <div className="text-sm font-medium text-default-600 mb-2">
              Potential return on your ad spend:
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              ${roasData.avgPotentialReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </div>
            <div className="text-xs text-default-500">
              Range: ${roasData.minPotentialReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${roasData.maxPotentialReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </div>
          </div>
        </div>
      </Card>

      <Button
        variant="solid"
        color="primary"
        radius="lg"
        fullWidth
        size="lg"
        onPress={onNext}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
      >
        Continue
      </Button>
    </div>
  );
}
