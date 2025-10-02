"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  Question,
  FormResponse,
  QuestionState,
  ConversationFormConfig,
} from "../types/conversation-form";

interface ConversationFormContextType {
  state: QuestionState;
  currentQuestion: Question | null;
  goToNext: () => void;
  goToPrevious: () => void;
  updateResponse: (questionId: string, value: any) => void;
  resetForm: () => void;
  isComplete: boolean;
  progress: number;
}

const ConversationFormContext =
  createContext<ConversationFormContextType | null>(null);

type Action =
  | { type: "NEXT_QUESTION" }
  | { type: "PREVIOUS_QUESTION" }
  | { type: "UPDATE_RESPONSE"; questionId: string; value: any }
  | { type: "RESET_FORM" }
  | { type: "INITIALIZE"; questions: Question[] };

function conversationFormReducer(
  state: QuestionState,
  action: Action,
): QuestionState {
  switch (action.type) {
    case "INITIALIZE": {
      return {
        currentIndex: 0,
        responses: {},
        isComplete: false,
        canGoBack: false,
        canGoNext: action.questions.length > 0,
        totalQuestions: action.questions.length,
      };
    }

    case "NEXT_QUESTION": {
      const nextIndex = state.currentIndex + 1;
      const isComplete = nextIndex >= state.totalQuestions;

      return {
        ...state,
        currentIndex: nextIndex,
        isComplete,
        canGoBack: nextIndex > 0,
        canGoNext: !isComplete,
      };
    }

    case "PREVIOUS_QUESTION": {
      const prevIndex = Math.max(0, state.currentIndex - 1);
      return {
        ...state,
        currentIndex: prevIndex,
        canGoBack: prevIndex > 0,
        canGoNext: true,
        isComplete: false,
      };
    }

    case "UPDATE_RESPONSE": {
      const newResponses = {
        ...state.responses,
        [action.questionId]: action.value,
      };

      return {
        ...state,
        responses: newResponses,
      };
    }

    case "RESET_FORM": {
      return {
        currentIndex: 0,
        responses: {},
        isComplete: false,
        canGoBack: false,
        canGoNext: true,
        totalQuestions: 0,
      };
    }

    default:
      return state;
  }
}

interface ConversationFormProviderProps {
  children: React.ReactNode;
  config: ConversationFormConfig;
}

export function ConversationFormProvider({
  children,
  config,
}: ConversationFormProviderProps) {
  const [state, dispatch] = useReducer(conversationFormReducer, {
    currentIndex: 0,
    responses: {},
    isComplete: false,
    canGoBack: false,
    canGoNext: config.questions.length > 0,
    totalQuestions: config.questions.length,
  });

  // Initialize form when questions change
  React.useEffect(() => {
    dispatch({ type: "INITIALIZE", questions: config.questions });
  }, [config.questions]);

  const currentQuestion = config.questions[state.currentIndex] || null;
  const progress =
    config.questions.length > 0
      ? (state.currentIndex / config.questions.length) * 100
      : 0;

  const goToNext = useCallback(() => {
    if (state.canGoNext && !state.isComplete) {
      dispatch({ type: "NEXT_QUESTION" });
    } else if (state.isComplete) {
      config.onComplete(state.responses);
    }
  }, [state.canGoNext, state.isComplete, state.responses, config]);

  const goToPrevious = useCallback(() => {
    if (state.canGoBack) {
      dispatch({ type: "PREVIOUS_QUESTION" });
    }
  }, [state.canGoBack]);

  const updateResponse = useCallback((questionId: string, value: any) => {
    dispatch({ type: "UPDATE_RESPONSE", questionId, value });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  const contextValue: ConversationFormContextType = {
    state,
    currentQuestion,
    goToNext,
    goToPrevious,
    updateResponse,
    resetForm,
    isComplete: state.isComplete,
    progress,
  };

  return (
    <ConversationFormContext.Provider value={contextValue}>
      {children}
    </ConversationFormContext.Provider>
  );
}

export function useConversationForm() {
  const context = useContext(ConversationFormContext);
  if (!context) {
    throw new Error(
      "useConversationForm must be used within a ConversationFormProvider",
    );
  }
  return context;
}
