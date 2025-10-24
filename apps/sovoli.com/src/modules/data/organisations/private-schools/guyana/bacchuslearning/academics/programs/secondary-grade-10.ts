import { SECONDARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  secondaryProgramHighlights,
  BLCGY_SECONDARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
} from "./shared";

export const BLCGY_SECONDARY_GRADE_10_PROGRAM: Program = {
  id: "blcgy-secondary-grade-10",
  slug: "grade-10",
  audience: "parent",
  name: "Grade 10",
  admission: {
    id: "blcgy-secondary-grade-10-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 15, maxAgeYears: 16 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "CSEC excellence and achievement",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description: "CSEC examination year with comprehensive academic preparation",
  photos: SECONDARY_PHOTOS,
  cycles: [],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade10-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "CSEC Mathematics",
      units: [
        {
          title: "CSEC Mathematics Excellence",
          topics: [
            "Advanced mathematical concepts",
            "Problem-solving strategies",
            "CSEC exam techniques",
            "Mathematical reasoning",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade10-english",
      subject: { id: "english", name: "English Language" },
      title: "CSEC English Language",
      units: [
        {
          title: "CSEC English Excellence",
          topics: [
            "Advanced language skills",
            "Literature analysis",
            "Writing mastery",
            "CSEC exam preparation",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade10-science",
      subject: { id: "science", name: "Integrated Science" },
      title: "CSEC Integrated Science",
      units: [
        {
          title: "CSEC Science Excellence",
          topics: [
            "Advanced scientific concepts",
            "Laboratory techniques",
            "Scientific investigation",
            "CSEC exam preparation",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade10-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "CSEC Social Studies",
      units: [
        {
          title: "CSEC Social Studies Excellence",
          topics: [
            "Advanced history and geography",
            "Political and economic analysis",
            "Social issues evaluation",
            "CSEC exam preparation",
          ],
        },
      ],
    },
  ],
};
