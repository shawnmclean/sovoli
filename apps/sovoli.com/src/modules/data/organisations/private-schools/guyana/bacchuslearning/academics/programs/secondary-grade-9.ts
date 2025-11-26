import { SECONDARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  secondaryProgramHighlights,
  BLCGY_SECONDARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
} from "./shared";

export const BLCGY_SECONDARY_GRADE_9_PROGRAM: Program = {
  id: "blcgy-secondary-grade-9",
  slug: "grade-9",
  audience: "parent",
  name: "Grade 9",
  admission: {
    id: "blcgy-secondary-grade-9-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 14, maxAgeYears: 15 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "CSEC preparation begins",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description: "CSEC preparation with advanced academic focus",
  media: SECONDARY_PHOTOS,
  cycles: [],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade9-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "CSEC Mathematics Preparation",
      units: [
        {
          title: "CSEC Mathematics",
          topics: [
            "Advanced algebra",
            "Geometry and trigonometry",
            "Statistics and probability",
            "CSEC exam techniques",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade9-english",
      subject: { id: "english", name: "English Language" },
      title: "CSEC English Preparation",
      units: [
        {
          title: "CSEC English",
          topics: [
            "Advanced literature analysis",
            "Essay writing mastery",
            "Language skills",
            "CSEC exam preparation",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade9-science",
      subject: { id: "science", name: "Integrated Science" },
      title: "CSEC Science Preparation",
      units: [
        {
          title: "CSEC Science",
          topics: [
            "Advanced scientific concepts",
            "Laboratory skills",
            "Scientific investigation",
            "CSEC preparation",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade9-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "CSEC Social Studies Preparation",
      units: [
        {
          title: "CSEC Social Studies",
          topics: [
            "Advanced history and geography",
            "Political and economic systems",
            "Social issues analysis",
            "CSEC preparation",
          ],
        },
      ],
    },
  ],
};
