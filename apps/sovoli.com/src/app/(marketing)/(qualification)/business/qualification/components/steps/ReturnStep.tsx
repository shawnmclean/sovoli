"use client";

import { useState, useMemo } from "react";
import { Slider } from "@sovoli/ui/components/slider";
import { Input } from "@sovoli/ui/components/input";
import type { SliderValue } from "@sovoli/ui/components/slider";

export interface ReturnStepProps {
  value: number;
  onChange: (value: number) => void;
}

const MIN_VALUE = 0;
const MAX_VALUE = 100000;
const STEP = 100;

export function ReturnStep({ value, onChange }: ReturnStepProps) {
  const [inputValue, setInputValue] = useState<string>((value || 0).toString());

  // Derive display value from input (no maximum limit)
  const displayValue = useMemo(() => {
    const parsed = parseFloat(inputValue);
    if (!Number.isNaN(parsed) && inputValue !== "" && inputValue !== ".") {
      return Math.max(MIN_VALUE, parsed);
    }
    return value || 0;
  }, [inputValue, value]);

  const handleSliderChange = (newValue: SliderValue) => {
    const numValue = Array.isArray(newValue) ? newValue[0] : newValue;
    const clampedValue = typeof numValue === "number" ? numValue : 0;
    setInputValue(clampedValue.toString());
    onChange(clampedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value;
    // Allow only numbers and decimal point
    const numericValue = inputStr.replace(/[^0-9.]/g, "");
    setInputValue(numericValue);

    // Parse the numeric value
    const parsedValue = parseFloat(numericValue) || 0;
    // Only clamp to minimum (no maximum limit), ensure no negative values
    const finalValue = Math.max(MIN_VALUE, parsedValue);

    // Update if valid
    if (numericValue && !Number.isNaN(finalValue)) {
      onChange(finalValue);
    } else if (numericValue === "" || numericValue === ".") {
      // Allow empty or just decimal point for user typing
      onChange(0);
    }
  };

  const handleInputBlur = () => {
    // On blur, ensure we have a valid value (no maximum limit)
    const parsedValue = parseFloat(inputValue) || 0;
    const finalValue = Math.max(MIN_VALUE, parsedValue);
    setInputValue(finalValue.toString());
    onChange(finalValue);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()} JMD`;
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">
          What was your return? How much did you make?
        </h1>
      </div>

      <div className="space-y-4">
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          variant="bordered"
          size="lg"
          fullWidth
          placeholder="0.00"
          startContent={<span className="text-default-500">$</span>}
          endContent={<span className="text-default-500 text-sm">JMD</span>}
        />

        <Slider
          aria-label="Return value"
          value={Math.min(displayValue, MAX_VALUE)}
          onChange={handleSliderChange}
          minValue={MIN_VALUE}
          maxValue={MAX_VALUE}
          step={STEP}
          size="lg"
          className="w-full"
        />

        <div className="flex justify-between text-sm text-default-500">
          <span>{formatCurrency(MIN_VALUE)}</span>
          <span>
            {displayValue > MAX_VALUE
              ? `${formatCurrency(MAX_VALUE)}+`
              : formatCurrency(MAX_VALUE)}
          </span>
        </div>
      </div>
    </div>
  );
}
