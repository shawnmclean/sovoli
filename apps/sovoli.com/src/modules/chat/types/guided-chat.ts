export type Audience = "parent" | "student";

export type QuestionType = "quick_reply" | "drawer" | "text_input";

export interface QuickReplyOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  quickReplies?: QuickReplyOption[];
  drawerComponent?: string;
  required?: boolean;
}

export interface QuestionResponse {
  questionId: string;
  value: string;
  displayValue: string;
  isUser?: boolean;
}

export interface FlowStep {
  question: Question;
  response?: QuestionResponse;
}

export interface ChatFlow {
  id: string;
  audience: Audience;
  steps: FlowStep[];
  currentStepIndex: number;
}

export interface ProgramInfo {
  id: string;
  name: string;
  description: string;
  ageRange: {
    minYears: number;
    minMonths: number;
    maxYears: number;
    maxMonths: number;
  };
}

export interface AgeSelection {
  years: number;
  months: number;
}
