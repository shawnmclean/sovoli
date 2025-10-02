"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
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

  const handleValueChange = (newValue: string | number) => {
    setSelectedValue(newValue);
    onChange(newValue);
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

      {/* Simple Wheel Picker */}
      <div className="w-full max-w-xs">
        <div className="relative h-48 overflow-hidden border border-default-200 rounded-lg bg-default-50">
          {/* Selection indicator */}
          <div className="absolute top-1/2 left-0 right-0 h-12 -translate-y-1/2 bg-primary/10 border-y border-primary/20 pointer-events-none z-10" />

          {/* Options list */}
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="py-20">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleValueChange(option.value)}
                  className={`w-full h-12 flex items-center justify-center text-center transition-all duration-200 ${
                    selectedValue === option.value
                      ? "text-primary font-semibold scale-105"
                      : "text-default-600 hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
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
