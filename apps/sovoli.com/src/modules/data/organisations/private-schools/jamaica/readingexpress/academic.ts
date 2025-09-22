import type { AcademicModule, Program } from "~/modules/academics/types";

const READING_EXPRESS_PROGRAM: Program = {
  id: "reading-express-remedial",
  slug: "remedial-reading",
  name: "Remedial Reading Programme",
  audience: "parent",
  description:
    "Weekend and after-school small group sessions that strengthen phonics, fluency, comprehension, and confidence for struggling readers.",
  tagline: "Unlock confident readers",
  outcome:
    "Students improve decoding, comprehension, and study habits through targeted literacy intervention.",
  quickFacts: [
    "Location: Regal Plaza, Cross Roads",
    "Schedule: Weekend and after-school sessions",
    "Focus: Struggling readers who need personalised support",
  ],
  highlights: [
    {
      icon: "book-open",
      label: "Literacy Specialists",
      description: "Led by experienced reading specialists who customise lessons for each learner.",
    },
    {
      icon: "users",
      label: "Small Groups",
      description: "Maintains intimate group sizes to maximise individual attention.",
    },
    {
      icon: "clock",
      label: "Flexible Scheduling",
      description: "Evening and weekend options support busy family schedules.",
    },
  ],
};

export const READING_EXPRESS_ACADEMIC: AcademicModule = {
  programs: [READING_EXPRESS_PROGRAM],
};
