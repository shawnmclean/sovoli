export type QuestionType =
  | "wheel-picker"
  | "text-input"
  | "select"
  | "radio"
  | "checkbox"
  | "date-picker"
  | "number-input";

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface WheelPickerQuestion extends BaseQuestion {
  type: "wheel-picker";
  options: Array<{
    value: string | number;
    label: string;
  }>;
  defaultValue?: string | number;
}

export interface TextInputQuestion extends BaseQuestion {
  type: "text-input";
  multiline?: boolean;
  maxLength?: number;
}

export interface SelectQuestion extends BaseQuestion {
  type: "select";
  options: Array<{
    value: string | number;
    label: string;
  }>;
  multiple?: boolean;
}

export interface RadioQuestion extends BaseQuestion {
  type: "radio";
  options: Array<{
    value: string | number;
    label: string;
  }>;
}

export interface CheckboxQuestion extends BaseQuestion {
  type: "checkbox";
  options: Array<{
    value: string | number;
    label: string;
  }>;
  multiple?: boolean;
}

export interface DatePickerQuestion extends BaseQuestion {
  type: "date-picker";
  minDate?: Date;
  maxDate?: Date;
}

export interface NumberInputQuestion extends BaseQuestion {
  type: "number-input";
  min?: number;
  max?: number;
  step?: number;
}

export type Question =
  | WheelPickerQuestion
  | TextInputQuestion
  | SelectQuestion
  | RadioQuestion
  | CheckboxQuestion
  | DatePickerQuestion
  | NumberInputQuestion;

export interface FormResponse {
  [questionId: string]: any;
}

export interface ConversationFormConfig {
  questions: Question[];
  onComplete: (responses: FormResponse) => void;
  onCancel?: () => void;
  showProgress?: boolean;
  allowBackNavigation?: boolean;
}

export interface QuestionState {
  currentIndex: number;
  responses: FormResponse;
  isComplete: boolean;
  canGoBack: boolean;
  canGoNext: boolean;
  totalQuestions: number;
}
