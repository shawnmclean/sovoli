"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@sovoli/ui/components/button";
import { AgePickerDrawer } from "./AgePickerDrawer";
import { getProgramForAge, formatAgeDisplay } from "../utils/programMapping";
import type { AgeSelection } from "../types/guided-chat";
import type {
  UnifiedMessage,
  QuestionState,
  GuidedFlowState,
} from "../types/message";

interface GuidedFlowManagerProps {
  audience: "parent" | "student";
  onFlowComplete?: () => void;
  messageManager: {
    messages: UnifiedMessage[];
    guidedFlow: GuidedFlowState;
    addQuestion: (question: QuestionState) => void;
    addUserResponse: (
      questionId: string,
      value: string,
      displayValue: string,
    ) => void;
    addSystemResponse: (content: string, questionId?: string) => void;
    completeGuidedFlow: () => void;
    getCurrentQuestion: () => QuestionState | null;
    isQuestionAnswered: (questionId: string) => boolean;
  };
}

export function GuidedFlowManager({
  audience,
  onFlowComplete,
  messageManager,
}: GuidedFlowManagerProps) {
  const {
    guidedFlow,
    addQuestion,
    addUserResponse,
    addSystemResponse,
    completeGuidedFlow,
    getCurrentQuestion,
    isQuestionAnswered,
  } = messageManager;

  const [isAgePickerOpen, setIsAgePickerOpen] = useState(false);
  const hasInitialized = useRef(false);

  // Initialize the flow based on audience
  useEffect(() => {
    if (
      audience === "parent" &&
      !hasInitialized.current &&
      guidedFlow.questions.length === 0
    ) {
      console.log("Adding parent question");
      hasInitialized.current = true;
      addQuestion({
        id: "child-age",
        text: "How old is your child?",
        isActive: true,
        quickReplies: [
          { id: "age-2", label: "2", value: "2" },
          { id: "age-3", label: "3", value: "3" },
          { id: "age-4", label: "4", value: "4" },
          { id: "age-5", label: "5", value: "5" },
          { id: "age-other", label: "Other", value: "other" },
        ],
      });
    }
  }, [audience, guidedFlow.questions.length, addQuestion]);

  const currentQuestion = getCurrentQuestion();

  const handleQuickReply = (value: string, displayValue: string) => {
    if (!currentQuestion) return;

    // Handle age question specifically - open age picker
    if (currentQuestion.id === "child-age") {
      setIsAgePickerOpen(true);
      return;
    }

    // For other questions, add response and complete flow
    addUserResponse(currentQuestion.id, value, displayValue);
    completeGuidedFlow();
    onFlowComplete?.();
  };

  const handleAgeSelected = (age: AgeSelection) => {
    if (!currentQuestion) return;

    const ageDisplay = formatAgeDisplay(age);
    const program = getProgramForAge(age);

    // Add user response with precise age
    addUserResponse(
      currentQuestion.id,
      `${age.years}-${age.months}`,
      ageDisplay,
    );

    // Add system response with program recommendation
    if (program) {
      addSystemResponse(
        `Perfect, ${ageDisplay}. That places them in "${program.name}".`,
        "program-recommendation",
      );
    }

    // Complete the flow
    completeGuidedFlow();
    onFlowComplete?.();
  };

  return (
    <>
      {/* Quick Reply Buttons - only show if question exists and hasn't been answered */}
      {currentQuestion?.quickReplies &&
        !isQuestionAnswered(currentQuestion.id) &&
        !guidedFlow.isComplete && (
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
      />
    </>
  );
}
