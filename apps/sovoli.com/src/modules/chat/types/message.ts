export type MessageType =
  | "question"
  | "user_response"
  | "system_response"
  | "ai_message";

export interface UnifiedMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  metadata?: {
    questionId?: string;
    value?: string;
    isGuided?: boolean;
  };
}

export interface QuestionState {
  id: string;
  text: string;
  isActive: boolean;
  quickReplies?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  drawerComponent?: string;
}

export interface GuidedFlowState {
  currentQuestionId: string | null;
  questions: QuestionState[];
  responses: Record<string, string>; // questionId -> response value
  isComplete: boolean;
}
