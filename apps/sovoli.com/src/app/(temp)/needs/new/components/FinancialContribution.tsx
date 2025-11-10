"use client";

import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";

interface FinancialContributionProps {
  amount: string;
  currency: "USD" | "JMD";
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: "USD" | "JMD") => void;
}

export function FinancialContribution({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
}: FinancialContributionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Financial Contribution</h2>
      <div className="flex gap-4">
        <div className="w-32">
          <Select
            size="lg"
            label="Currency"
            selectedKeys={[currency]}
            onSelectionChange={(keys) =>
              onCurrencyChange(Array.from(keys)[0] as "USD" | "JMD")
            }
          >
            <SelectItem key="USD">USD</SelectItem>
            <SelectItem key="JMD">JMD</SelectItem>
          </Select>
        </div>
        <Input
          size="lg"
          type="number"
          min={0}
          label="Amount"
          placeholder="Enter the amount you wish to contribute"
          value={amount}
          onValueChange={onAmountChange}
          className="flex-1"
        />
      </div>
      <div className="rounded-lg border border-default-200 bg-default-50/50 p-4">
        <p className="text-sm text-default-600">
          We'll be in touch with you on how to send your contribution securely.
        </p>
      </div>
    </div>
  );
}
