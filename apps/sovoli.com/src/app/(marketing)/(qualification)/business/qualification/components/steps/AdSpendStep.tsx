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
  const handleOptionClick = (optionValue: string) => {
    // Always trigger onChange when clicking, even if it's the same value
    // This allows users to click the same option again after going back
    onChange(optionValue);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">
          How much did you spend on ads the past month?
        </h1>
      </div>

      <RadioGroup
        value={value ?? undefined}
        onValueChange={(newValue) => {
          // Only call onChange if value actually changed (normal radio behavior)
          if (newValue !== value) {
            onChange(newValue);
          }
        }}
        classNames={{
          wrapper: "space-y-3",
        }}
      >
        {AD_SPEND_OPTIONS.map((option) => (
          <label
            key={option.value}
            htmlFor={`ad-spend-${option.value}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleOptionClick(option.value);
            }}
            className="cursor-pointer w-full block"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                handleOptionClick(option.value);
              }
            }}
          >
            <CustomRadio
              value={option.value}
              className="w-full pointer-events-none"
              id={`ad-spend-${option.value}`}
            >
              <span className="text-base font-medium pointer-events-none select-none">
                {option.label}
              </span>
            </CustomRadio>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
