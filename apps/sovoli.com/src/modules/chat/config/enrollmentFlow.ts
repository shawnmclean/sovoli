export const enrollmentFlow = {
  age: {
    id: "age",
    text: "How old is your child?",
    inputType: "age",
    next: "location",
  },
  location: {
    id: "location",
    text: "Thank you! Where are you located?",
    inputType: "location",
    next: "thankyou",
  },
  thankyou: {
    id: "thankyou",
    text: "Thank you! I'll be in touch soon.",
    inputType: null,
    next: null,
  },
} as const;

export type FlowStep = (typeof enrollmentFlow)[keyof typeof enrollmentFlow];
export type FlowStepId = keyof typeof enrollmentFlow;
