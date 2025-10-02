"use client";

import React from "react";
import { Question } from "../../types/conversation-form";
import { AgeWheelPickerQuestion } from "./AgeWheelPickerQuestion";
import { TextInputQuestion } from "./TextInputQuestion";

interface QuestionRendererProps {
  question: Question;
  value?: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canGoBack: boolean;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoBack,
}: QuestionRendererProps) {
  switch (question.type) {
    case "wheel-picker":
      return (
        <AgeWheelPickerQuestion
          question={question}
          value={value}
          onChange={onChange}
          onNext={onNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
        />
      );

    case "text-input":
      return (
        <TextInputQuestion
          question={question}
          value={value}
          onChange={onChange}
          onNext={onNext}
          onPrevious={onPrevious}
          canGoBack={canGoBack}
        />
      );

    // Add more question types here as needed
    default:
      return (
        <div className="p-6 text-center">
          <p className="text-default-500">
            Question type "{question.type}" is not yet implemented.
          </p>
        </div>
      );
  }
}
