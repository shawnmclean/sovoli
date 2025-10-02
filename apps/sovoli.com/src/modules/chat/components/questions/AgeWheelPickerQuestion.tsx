"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  WheelPicker,
  WheelPickerWrapper,
} from "@sovoli/ui/components/wheel-picker";
import type { WheelPickerOption } from "@sovoli/ui/components/wheel-picker";
import type { WheelPickerQuestion } from "../../types/conversation-form";

interface AgeWheelPickerQuestionProps {
  question: WheelPickerQuestion;
  value?: string | number;
  onChange: (value: string | number) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canGoBack: boolean;
}

export function AgeWheelPickerQuestion({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoBack,
}: AgeWheelPickerQuestionProps) {
  const [selectedValue, setSelectedValue] = useState<string | number>(
    value ?? question.defaultValue ?? question.options[0]?.value ?? "",
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Convert question options to WheelPickerOption format
  const wheelPickerOptions: WheelPickerOption[] = question.options.map(
    (option) => ({
      label: option.label,
      value: option.value.toString(),
    }),
  );

  const handleValueChange = (newValue: string) => {
    // Convert back to original type (string or number)
    const originalValue = question.options.find(
      (opt) => opt.value.toString() === newValue,
    )?.value;
    if (originalValue !== undefined) {
      setSelectedValue(originalValue);
      onChange(originalValue);
    }
  };

  const handleNext = () => {
    onChange(selectedValue);
    onNext();
  };

  const isNextDisabled = !selectedValue && question.required;

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Question Label */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {question.label}
        </h3>
        {question.placeholder && (
          <p className="text-sm text-default-500">{question.placeholder}</p>
        )}
      </div>

      {/* Wheel Picker */}
      <div className="w-full max-w-xs">
        <WheelPickerWrapper>
          <WheelPicker
            options={wheelPickerOptions}
            value={selectedValue.toString()}
            onValueChange={handleValueChange}
          />
        </WheelPickerWrapper>
      </div>

      {/* Selected Value Display */}
      <div className="text-center">
        <p className="text-sm text-default-600">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {question.options.find((opt) => opt.value === selectedValue)
              ?.label ?? selectedValue}
          </span>
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 w-full max-w-xs">
        {canGoBack && onPrevious && (
          <Button variant="bordered" onPress={onPrevious} className="flex-1">
            Back
          </Button>
        )}
        <Button
          color="primary"
          onPress={handleNext}
          isDisabled={isNextDisabled}
          className="flex-1"
        >
          {question.required ? "Continue" : "Next"}
        </Button>
      </div>
    </div>
  );
}
