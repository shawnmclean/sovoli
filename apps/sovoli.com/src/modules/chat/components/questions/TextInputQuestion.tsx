"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Button } from "@sovoli/ui/components/button";
import type { TextInputQuestion as TextInputQuestionType } from "../../types/conversation-form";

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
  onPrevious: _onPrevious,
  canGoBack: _canGoBack,
}: TextInputQuestionProps) {
  const [inputValue, setInputValue] = useState(value ?? "");

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
    <div className="flex flex-col space-y-4">
      {/* Input Field */}
      <div className="w-full">
        {question.multiline ? (
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={question.placeholder ?? "Type your response..."}
            maxLength={question.maxLength}
            rows={3}
            className="w-full px-3 py-2 border border-default-300 rounded-lg bg-background text-foreground placeholder:text-default-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            style={{ minHeight: "80px", maxHeight: "200px" }}
          />
        ) : (
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={question.placeholder ?? "Type your response..."}
            variant="bordered"
            size="lg"
            maxLength={question.maxLength}
            className="w-full"
          />
        )}
        {question.maxLength && (
          <p className="text-xs text-default-500 mt-1 text-right">
            {inputValue.length}/{question.maxLength}
          </p>
        )}
      </div>

      {/* Send Button */}
      <div className="flex justify-end">
        <Button
          color="primary"
          onPress={handleNext}
          isDisabled={isNextDisabled}
          size="sm"
          className="min-w-20"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
