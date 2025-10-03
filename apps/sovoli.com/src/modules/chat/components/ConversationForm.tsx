"use client";

import React, { useState } from "react";
import {
  ConversationFormProvider,
  useConversationForm,
} from "../context/ConversationFormContext";
import { QuestionRenderer } from "./questions/QuestionRenderer";
import { Progress } from "@sovoli/ui/components/progress";
import { Button } from "@sovoli/ui/components/button";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
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

  const [showTyping, setShowTyping] = useState(false);
  const [showUserResponse, setShowUserResponse] = useState(false);
  const [userResponse, setUserResponse] = useState<string>("");

  if (!currentQuestion) {
    return (
      <div className="p-6 text-center">
        <p className="text-default-500">No questions available.</p>
      </div>
    );
  }

  const handleResponseChange = (value: string | number) => {
    updateResponse(currentQuestion.id, value);
    setUserResponse(String(value));
  };

  const handleNext = () => {
    // Show user's response first
    setShowUserResponse(true);

    // Then simulate bot processing
    setTimeout(() => {
      setShowTyping(true);
      setShowUserResponse(false);

      // Move to next question
      setTimeout(() => {
        setShowTyping(false);
        goToNext();
      }, 1000);
    }, 500);
  };

  const handlePrevious = () => {
    setShowTyping(true);
    // Simulate bot processing time
    setTimeout(() => {
      setShowTyping(false);
      goToPrevious();
    }, 500);
  };

  const currentValue = state.responses[currentQuestion.id] as
    | string
    | number
    | undefined;

  return (
    <div className="flex flex-col space-y-4">
      {/* Bot Message with Question */}
      <div className="flex justify-start">
        <div className="flex items-start gap-3 max-w-[85%]">
          <Badge
            color="success"
            content=""
            placement="bottom-right"
            shape="circle"
          >
            <Avatar src="/logo.svg" name="Sovoli" radius="full" size="sm" />
          </Badge>
          <div className="bg-default-100 text-default-foreground rounded-2xl rounded-bl-md px-4 py-3">
            <p className="text-sm whitespace-pre-wrap">
              {currentQuestion.label}
            </p>
          </div>
        </div>
      </div>

      {/* User Response Message */}
      {showUserResponse && userResponse && (
        <div className="flex justify-end">
          <div className="max-w-[85%]">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3">
              <p className="text-sm">{userResponse}</p>
            </div>
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {showTyping && (
        <div className="flex justify-start">
          <div className="flex items-start gap-3 max-w-[85%]">
            <Badge
              color="success"
              content=""
              placement="bottom-right"
              shape="circle"
            >
              <Avatar src="/logo.svg" name="Sovoli" radius="full" size="sm" />
            </Badge>
            <div className="bg-default-100 text-default-foreground rounded-2xl rounded-bl-md px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
                <span className="text-xs text-default-500">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {config.showProgress && (
        <div className="px-2">
          <Progress
            value={progress}
            className="w-full"
            size="sm"
            color="primary"
          />
          <p className="text-xs text-default-500 mt-1 text-center">
            Question {state.currentIndex + 1} of {state.totalQuestions}
          </p>
        </div>
      )}

      {/* User Input Field */}
      <div className="px-2">
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
        <div className="flex justify-center pt-4">
          <Button
            variant="light"
            color="danger"
            onPress={config.onCancel}
            size="sm"
          >
            Cancel
          </Button>
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
