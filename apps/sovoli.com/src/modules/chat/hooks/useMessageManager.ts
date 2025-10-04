"use client";

import { useState, useCallback } from "react";
import type {
  UnifiedMessage,
  QuestionState,
  GuidedFlowState,
} from "../types/message";

export function useMessageManager() {
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);
  const [guidedFlow, setGuidedFlow] = useState<GuidedFlowState>({
    currentQuestionId: null,
    questions: [],
    responses: {},
    isComplete: false,
  });

  const addMessage = useCallback(
    (message: Omit<UnifiedMessage, "id" | "timestamp">) => {
      const newMessage: UnifiedMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    [],
  );

  const addQuestion = useCallback(
    (question: QuestionState) => {
      // Check if question already exists
      setGuidedFlow((prev) => {
        if (prev.questions.some((q) => q.id === question.id)) {
          console.log("Question already exists, skipping:", question.id);
          return prev;
        }

        // Add question as a system message
        addMessage({
          type: "question",
          content: question.text,
          metadata: {
            questionId: question.id,
            isGuided: true,
          },
        });

        // Update guided flow state
        return {
          ...prev,
          currentQuestionId: question.id,
          questions: [...prev.questions, question],
        };
      });
    },
    [addMessage],
  );

  const addUserResponse = useCallback(
    (questionId: string, value: string, displayValue: string) => {
      // Add user response as a user message
      addMessage({
        type: "user_response",
        content: displayValue,
        metadata: {
          questionId,
          value,
          isGuided: true,
        },
      });

      // Update guided flow state
      setGuidedFlow((prev) => ({
        ...prev,
        responses: {
          ...prev.responses,
          [questionId]: value,
        },
      }));
    },
    [addMessage],
  );

  const addSystemResponse = useCallback(
    (content: string, questionId?: string) => {
      addMessage({
        type: "system_response",
        content,
        metadata: {
          questionId,
          isGuided: true,
        },
      });
    },
    [addMessage],
  );

  const addAIMessage = useCallback(
    (content: string) => {
      addMessage({
        type: "ai_message",
        content,
      });
    },
    [addMessage],
  );

  const completeGuidedFlow = useCallback(() => {
    setGuidedFlow((prev) => ({
      ...prev,
      isComplete: true,
      currentQuestionId: null,
    }));
  }, []);

  const getCurrentQuestion = useCallback(() => {
    if (!guidedFlow.currentQuestionId) return null;
    return (
      guidedFlow.questions.find((q) => q.id === guidedFlow.currentQuestionId) ??
      null
    );
  }, [guidedFlow]);

  const isQuestionAnswered = useCallback(
    (questionId: string) => {
      return questionId in guidedFlow.responses;
    },
    [guidedFlow.responses],
  );

  return {
    messages,
    guidedFlow,
    addQuestion,
    addUserResponse,
    addSystemResponse,
    addAIMessage,
    completeGuidedFlow,
    getCurrentQuestion,
    isQuestionAnswered,
  };
}
