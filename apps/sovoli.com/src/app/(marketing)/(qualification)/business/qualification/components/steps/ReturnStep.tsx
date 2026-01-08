"use client";

import { useState, useEffect } from "react";
import { Slider } from "@sovoli/ui/components/slider";
import type { SliderValue } from "@sovoli/ui/components/slider";

export interface ReturnStepProps {
  value: number;
  onChange: (value: number) => void;
}

const MIN_VALUE = 0;
const MAX_VALUE = 100000;
const STEP = 100;

export function ReturnStep({ value, onChange }: ReturnStepProps) {
  const [displayValue, setDisplayValue] = useState<number>(value || 0);

  useEffect(() => {
    setDisplayValue(value || 0);
  }, [value]);

  const handleChange = (newValue: SliderValue) => {
    const numValue = Array.isArray(newValue) ? newValue[0] : newValue;
    const clampedValue = typeof numValue === "number" ? numValue : 0;
    setDisplayValue(clampedValue);
    onChange(clampedValue);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()} JMD`;
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">What was your return? How much did you make?</h1>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {formatCurrency(displayValue)}
          </div>
        </div>

        <Slider
          aria-label="Return value"
          value={displayValue}
          onChange={handleChange}
          minValue={MIN_VALUE}
          maxValue={MAX_VALUE}
          step={STEP}
          size="lg"
          className="w-full"
        />

        <div className="flex justify-between text-sm text-default-500">
          <span>{formatCurrency(MIN_VALUE)}</span>
          <span>{formatCurrency(MAX_VALUE)}</span>
        </div>
      </div>
    </div>
  );
}
