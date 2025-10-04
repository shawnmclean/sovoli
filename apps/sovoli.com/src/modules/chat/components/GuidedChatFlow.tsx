"use client";

import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { AgePickerDrawer } from "./AgePickerDrawer";
import type {
  ChatFlow,
  QuestionResponse,
  AgeSelection,
} from "../types/guided-chat";
import { getProgramForAge, formatAgeDisplay } from "../utils/programMapping";

interface GuidedChatFlowProps {
  flow: ChatFlow;
  onResponse: (response: QuestionResponse) => void;
  onFlowComplete: (responses: QuestionResponse[]) => void;
}

export function GuidedChatFlow({
  flow,
  onResponse,
  onFlowComplete,
}: GuidedChatFlowProps) {
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [isAgePickerOpen, setIsAgePickerOpen] = useState(false);
  const [pendingAgeResponse, setPendingAgeResponse] = useState<string | null>(
    null,
  );
  const currentStep = flow.steps[flow.currentStepIndex];
  const currentQuestion = currentStep?.question;

  // Show the current question as a system message when it first appears
  useEffect(() => {
    if (currentQuestion) {
      // Check if this question has already been shown
      const questionAlreadyShown = responses.some(
        (response) => response.questionId === `question-${currentQuestion.id}`,
      );

      if (!questionAlreadyShown) {
        const questionResponse: QuestionResponse = {
          questionId: `question-${currentQuestion.id}`,
          value: currentQuestion.text,
          displayValue: currentQuestion.text,
          isUser: false,
        };

        setResponses((prev) => [...prev, questionResponse]);
        onResponse(questionResponse);
      }
    }
  }, [currentQuestion, onResponse, responses]);

  useEffect(() => {
    // Check if flow is complete
    if (flow.currentStepIndex >= flow.steps.length) {
      onFlowComplete(responses);
    }
  }, [flow.currentStepIndex, flow.steps.length, responses, onFlowComplete]);

  const handleQuickReply = (value: string, displayValue: string) => {
    const response: QuestionResponse = {
      questionId: currentQuestion?.id ?? "",
      value,
      displayValue,
      isUser: true,
    };

    // Special handling for age question
    if (currentQuestion?.id === "child-age" && value === "other") {
      setPendingAgeResponse(displayValue);
      setIsAgePickerOpen(true);
      return;
    }

    // For specific age values, also open the age picker for precise selection
    if (currentQuestion?.id === "child-age" && !isNaN(parseInt(value))) {
      setPendingAgeResponse(displayValue);
      setIsAgePickerOpen(true);
      return;
    }

    // Regular response handling
    setResponses((prev) => [...prev, response]);
    onResponse(response);
  };

  const handleAgeSelected = (age: AgeSelection) => {
    const program = getProgramForAge(age);
    const ageDisplay = formatAgeDisplay(age);

    // User response (age selection)
    const userResponse: QuestionResponse = {
      questionId: currentQuestion?.id ?? "",
      value: `${age.years}-${age.months}`,
      displayValue: ageDisplay,
      isUser: true,
    };

    setResponses((prev) => [...prev, userResponse]);
    onResponse(userResponse);

    // System response (program recommendation)
    if (program) {
      const systemResponse: QuestionResponse = {
        questionId: "program-recommendation",
        value: program.id,
        displayValue: `Perfect, ${ageDisplay}. That places them in "${program.name}".`,
        isUser: false,
      };

      setResponses((prev) => [...prev, systemResponse]);
      onResponse(systemResponse);
    }

    setIsAgePickerOpen(false);
    setPendingAgeResponse(null);
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <>
      {/* Quick Reply Buttons - only show if question exists and hasn't been answered */}
      {currentQuestion.quickReplies && (
        <div className="flex flex-wrap gap-2 justify-start">
          {currentQuestion.quickReplies.map((reply) => (
            <Button
              key={reply.id}
              size="sm"
              variant="bordered"
              className="text-xs"
              onPress={() => handleQuickReply(reply.value, reply.label)}
            >
              {reply.label}
            </Button>
          ))}
        </div>
      )}

      {/* Age Picker Drawer */}
      <AgePickerDrawer
        isOpen={isAgePickerOpen}
        onOpenChange={setIsAgePickerOpen}
        onAgeSelected={handleAgeSelected}
        initialAge={
          pendingAgeResponse
            ? { years: parseInt(pendingAgeResponse), months: 0 }
            : undefined
        }
      />
    </>
  );
}
