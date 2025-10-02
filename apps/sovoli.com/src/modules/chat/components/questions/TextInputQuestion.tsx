"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Button } from "@sovoli/ui/components/button";
import { TextInputQuestion as TextInputQuestionType } from "../../types/conversation-form";

interface TextInputQuestionProps {
  question: TextInputQuestionType;
  value?: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canGoBack: boolean;
}

export function TextInputQuestion({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoBack,
}: TextInputQuestionProps) {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleNext = () => {
    onChange(inputValue);
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !question.multiline) {
      e.preventDefault();
      handleNext();
    }
  };

  const isNextDisabled = question.required && !inputValue.trim();

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Question Label */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {question.label}
        </h3>
        {question.placeholder && (
          <p className="text-sm text-default-500">{question.placeholder}</p>
        )}
      </div>

      {/* Input Field */}
      <div className="w-full max-w-md mx-auto">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={question.placeholder}
          variant="bordered"
          size="lg"
          maxLength={question.maxLength}
          className="w-full"
          {...(question.multiline && {
            as: "textarea",
            minRows: 3,
            maxRows: 6,
          })}
        />
        {question.maxLength && (
          <p className="text-xs text-default-500 mt-1 text-right">
            {inputValue.length}/{question.maxLength}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 w-full max-w-md mx-auto">
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
