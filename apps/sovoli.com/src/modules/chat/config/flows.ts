import type { Question, ChatFlow } from "../types/guided-chat";

// Parent flow questions
const parentQuestions: Question[] = [
  {
    id: "child-age",
    type: "quick_reply",
    text: "How old is your child?",
    quickReplies: [
      { id: "age-2", label: "2", value: "2" },
      { id: "age-3", label: "3", value: "3" },
      { id: "age-4", label: "4", value: "4" },
      { id: "age-5", label: "5", value: "5" },
      { id: "age-other", label: "Other", value: "other" },
    ],
    required: true,
  },
];

// Student flow questions (placeholder for future implementation)
const studentQuestions: Question[] = [
  {
    id: "student-grade",
    type: "quick_reply",
    text: "What grade are you in?",
    quickReplies: [
      { id: "grade-k", label: "Kindergarten", value: "kindergarten" },
      { id: "grade-1", label: "1st Grade", value: "1st" },
      { id: "grade-2", label: "2nd Grade", value: "2nd" },
      { id: "grade-3", label: "3rd Grade", value: "3rd" },
      { id: "grade-4", label: "4th Grade", value: "4th" },
      { id: "grade-5", label: "5th Grade", value: "5th" },
    ],
    required: true,
  },
];

export function createParentFlow(): ChatFlow {
  return {
    id: "parent-flow",
    audience: "parent",
    steps: parentQuestions.map((question) => ({ question })),
    currentStepIndex: 0,
  };
}

export function createStudentFlow(): ChatFlow {
  return {
    id: "student-flow",
    audience: "student",
    steps: studentQuestions.map((question) => ({ question })),
    currentStepIndex: 0,
  };
}

export function createFlow(audience: "parent" | "student"): ChatFlow {
  return audience === "parent" ? createParentFlow() : createStudentFlow();
}
