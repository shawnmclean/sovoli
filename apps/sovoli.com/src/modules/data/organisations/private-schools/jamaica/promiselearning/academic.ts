import type { AcademicModule, Program } from "~/modules/academics/types";

const PROMISE_LEARNING_SPECIAL_PROGRAM: Program = {
  id: "promise-learning-special-education",
  slug: "special-education",
  name: "Special Education Programme",
  audience: "parent",
  description:
    "Individualised academic, behavioural, and vocational training for children and young adults on the autism spectrum or with learning disabilities.",
  tagline: "Advocates for autism",
  outcome:
    "Learners build communication, life, and workforce skills that support greater independence and community inclusion.",
  quickFacts: [
    "Established: 1993",
    "Ages: Children to young adults",
    "Focus: Autism spectrum and learning disabilities",
  ],
  highlights: [
    {
      icon: "book-open",
      label: "Individualised Plans",
      description: "Each student follows a customised education plan with therapeutic support.",
    },
    {
      icon: "users",
      label: "Specialist Team",
      description: "Led by trained special educators with experience supporting neurodiverse learners.",
    },
    {
      icon: "tool",
      label: "Life & Work Skills",
      description: "Programmes incorporate vocational, social, and life skills training for long-term success.",
    },
  ],
};

export const PROMISE_LEARNING_ACADEMIC: AcademicModule = {
  programs: [PROMISE_LEARNING_SPECIAL_PROGRAM],
};
