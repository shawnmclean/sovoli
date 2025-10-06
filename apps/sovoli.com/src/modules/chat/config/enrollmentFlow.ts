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
    inputType: undefined,
    next: null,
  },
} as const;

export type FlowStep = (typeof enrollmentFlow)[keyof typeof enrollmentFlow];
export type FlowStepId = keyof typeof enrollmentFlow;

export const parentFlow = {
  id: "parentOnboarding",
  start: "askChildAge",

  steps: {
    askChildAge: {
      id: "askChildAge",
      type: "age",
      prompt: "How old is your child?",
      inputKey: "year",
      next: "confirmAddAnotherChild",
    },

    confirmAddAnother: {
      id: "confirmAddAnotherChild",
      type: "buttons",
      prompt: "Would you like to add another child?",
      options: ["Yes", "No"],
      next: {
        Yes: "loop_addChild",
        No: "askLocation",
      },
    },

    loop_addChild: {
      id: "loop_addChild",
      type: "loop",
      loopContext: "children",
      next: "askChildAge",
    },

    askLocation: {
      id: "askLocation",
      type: "text",
      prompt: "Where are you located?",
      inputKey: "location",
      next: "showSummary",
    },

    showSummary: {
      id: "showSummary",
      type: "summary",
      prompt: "Thanks! Here’s what I’ve got:",
      summaryKeys: ["children", "location"],
      next: null,
    },
  },
};
