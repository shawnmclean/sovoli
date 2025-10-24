import { SECONDARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  secondaryProgramHighlights,
  BLCGY_SECONDARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
} from "./shared";

export const BLCGY_SECONDARY_GRADE_8_PROGRAM: Program = {
  id: "blcgy-secondary-grade-8",
  slug: "grade-8",
  audience: "parent",
  name: "Grade 8",
  admission: {
    id: "blcgy-secondary-grade-8-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 13, maxAgeYears: 14 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Advanced secondary foundations",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description: "Advanced secondary education building towards CSEC success",
  photos: SECONDARY_PHOTOS,
  cycles: [],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade8-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Advanced Mathematics",
      units: [
        {
          title: "Algebra and Functions",
          topics: [
            "Advanced algebraic expressions",
            "Quadratic equations",
            "Functions and graphs",
            "Inequalities",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade8-english",
      subject: { id: "english", name: "English Language" },
      title: "English Language and Literature",
      units: [
        {
          title: "Advanced Reading",
          topics: [
            "Complex literary analysis",
            "Critical thinking",
            "Text evaluation",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade8-science",
      subject: { id: "science", name: "Integrated Science" },
      title: "Advanced Integrated Science",
      units: [
        {
          title: "Scientific Concepts",
          topics: [
            "Advanced physics concepts",
            "Chemistry fundamentals",
            "Biology systems",
            "Scientific method",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade8-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Advanced Social Studies",
      units: [
        {
          title: "Society and Culture",
          topics: [
            "Advanced history",
            "Political systems",
            "Economic concepts",
            "Social issues",
          ],
        },
      ],
    },
  ],
};
