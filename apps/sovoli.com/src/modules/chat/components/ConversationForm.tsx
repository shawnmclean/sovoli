"use client";

import React from "react";
import {
  ConversationFormProvider,
  useConversationForm,
} from "../context/ConversationFormContext";
import { QuestionRenderer } from "./questions/QuestionRenderer";
import { Progress } from "@sovoli/ui/components/progress";
import { Button } from "@sovoli/ui/components/button";
import type { ConversationFormConfig } from "../types/conversation-form";

interface ConversationFormProps {
  config: ConversationFormConfig;
}

function ConversationFormContent({
  config,
}: {
  config: ConversationFormConfig;
}) {
  const {
    currentQuestion,
    state,
    goToNext,
    goToPrevious,
    updateResponse,
    progress,
  } = useConversationForm();

  if (!currentQuestion) {
    return (
      <div className="p-6 text-center">
        <p className="text-default-500">No questions available.</p>
      </div>
    );
  }

  const handleResponseChange = (value: string | number) => {
    updateResponse(currentQuestion.id, value);
  };

  const handleNext = () => {
    goToNext();
  };

  const handlePrevious = () => {
    goToPrevious();
  };

  const currentValue = state.responses[currentQuestion.id] as
    | string
    | number
    | undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      {config.showProgress && (
        <div className="p-4 border-b border-divider">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Question {state.currentIndex + 1} of {config.questions.length}
            </span>
            <span className="text-sm text-default-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center">
        <QuestionRenderer
          question={currentQuestion}
          value={currentValue}
          onChange={handleResponseChange}
          onNext={handleNext}
          onPrevious={config.allowBackNavigation ? handlePrevious : undefined}
          canGoBack={state.canGoBack && (config.allowBackNavigation ?? false)}
        />
      </div>

      {/* Cancel Button */}
      {config.onCancel && (
        <div className="p-4 border-t border-divider">
          <div className="flex justify-center">
            <Button
              variant="light"
              color="danger"
              onPress={config.onCancel}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ConversationForm({ config }: ConversationFormProps) {
  return (
    <ConversationFormProvider config={config}>
      <ConversationFormContent config={config} />
    </ConversationFormProvider>
  );
}
