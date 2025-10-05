export const enrollmentFlow = {
  age: {
    id: "age",
    text: "How old is your child?",
    inputType: "buttons" as const,
    options: ["3", "4", "5", "6", "7", "8+"] as const,
    next: "grade" as const,
  },
  grade: {
    id: "grade",
    text: "Which grade are they entering?",
    inputType: "buttons" as const,
    options: ["Nursery", "Prep", "Grade 1"] as const,
    next: "location" as const,
  },
  location: {
    id: "location",
    text: "Where are you located?",
    inputType: "text" as const,
    next: "summary" as const,
  },
  summary: {
    id: "summary",
    text: "Thank you! We'll now show programs that match your child's info.",
    inputType: "none" as const,
    next: null,
  },
} as const;

export type FlowStep = (typeof enrollmentFlow)[keyof typeof enrollmentFlow];
export type FlowStepId = keyof typeof enrollmentFlow;
