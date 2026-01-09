"use client";

import { RevenuePotentialCard } from "./RevenuePotentialCard";

export interface ROASCalculatorStepProps {
  adSpend: string | null;
  returnValue: number;
  onNext: () => void;
}

export function ROASCalculatorStep({
  adSpend,
  returnValue,
  onNext,
}: ROASCalculatorStepProps) {
  return (
    <RevenuePotentialCard
      adSpend={adSpend}
      returnValue={returnValue}
      onNext={onNext}
    />
  );
}
