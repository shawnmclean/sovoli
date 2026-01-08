"use client";

import { RadioGroup } from "@sovoli/ui/components/radio";
import { CustomRadio } from "@sovoli/ui/components/radio";

export interface AdSpendStepProps {
  value: string | null;
  onChange: (value: string) => void;
}

const AD_SPEND_OPTIONS = [
  { value: "0", label: "$0 USD" },
  { value: "100-500", label: "$100-$500 USD" },
  { value: "500-1000", label: "$500-$1,000 USD" },
  { value: "1000+", label: "$1,000+ USD" },
] as const;

export function AdSpendStep({ value, onChange }: AdSpendStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">How much did you spend on ads the past month?</h1>
      </div>

      <RadioGroup
        value={value ?? undefined}
        onValueChange={onChange}
        classNames={{
          wrapper: "space-y-3",
        }}
      >
        {AD_SPEND_OPTIONS.map((option) => (
          <CustomRadio
            key={option.value}
            value={option.value}
            className="w-full"
          >
            <span className="text-base font-medium">{option.label}</span>
          </CustomRadio>
        ))}
      </RadioGroup>
    </div>
  );
}
