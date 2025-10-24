import { SECONDARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  secondaryProgramHighlights,
  BLCGY_SECONDARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
} from "./shared";

export const BLCGY_SECONDARY_GRADE_11_PROGRAM: Program = {
  id: "blcgy-secondary-grade-11",
  slug: "grade-11",
  audience: "parent",
  name: "Grade 11",
  admission: {
    id: "blcgy-secondary-grade-11-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 16, maxAgeYears: 17 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Advanced CSEC and CAPE preparation",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description: "Advanced secondary education with CAPE preparation options",
  photos: SECONDARY_PHOTOS,
  cycles: [],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade11-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Advanced Mathematics",
      units: [
        {
          title: "Advanced Mathematical Concepts",
          topics: [
            "Calculus introduction",
            "Advanced algebra",
            "Statistics and probability",
            "Mathematical modeling",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade11-english",
      subject: { id: "english", name: "English Language" },
      title: "Advanced English Language",
      units: [
        {
          title: "Advanced Language Skills",
          topics: [
            "Advanced literature analysis",
            "Critical thinking",
            "Advanced writing techniques",
            "Language mastery",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade11-science",
      subject: { id: "science", name: "Advanced Science" },
      title: "Advanced Science",
      units: [
        {
          title: "Advanced Scientific Concepts",
          topics: [
            "Advanced physics",
            "Advanced chemistry",
            "Advanced biology",
            "Scientific research methods",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade11-social-studies",
      subject: { id: "social-studies", name: "Advanced Social Studies" },
      title: "Advanced Social Studies",
      units: [
        {
          title: "Advanced Social Analysis",
          topics: [
            "Advanced history",
            "Political science",
            "Economics",
            "Social research methods",
          ],
        },
      ],
    },
  ],
};
