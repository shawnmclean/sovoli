"use client";

import { Input } from "@sovoli/ui/components/input";

interface FinancialContributionProps {
  amount: string;
  onAmountChange: (value: string) => void;
}

export function FinancialContribution({
  amount,
  onAmountChange,
}: FinancialContributionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Financial Contribution</h2>
      <Input
        size="lg"
        type="number"
        min={0}
        label="Amount (JMD)"
        placeholder="Enter the amount you wish to contribute"
        value={amount}
        onValueChange={onAmountChange}
      />
    </div>
  );
}
