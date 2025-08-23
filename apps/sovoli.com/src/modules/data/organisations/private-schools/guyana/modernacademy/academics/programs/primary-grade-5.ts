import { GY_PRIMARY_GRADE_5_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_PRIMARY_GRADE_5_2025_T1 } from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  MAGY_PRIMARY_DEPT_ACTIVITIES,
  magyProgramQuickFacts,
} from "./shared";

export const MAGY_PRIMARY_GRADE_5_PROGRAM: Program = {
  id: "magy-primary-grade-5",
  slug: "grade-5",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_5_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_5_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade5-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Pre-NGSA Mathematics",
      units: [
        {
          title: "Advanced Mathematics",
          topics: [
            "Fractions and decimals",
            "Geometry and measurement",
            "Algebra basics",
            "Problem solving",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Reading for NGSA",
      units: [
        {
          title: "Reading Excellence",
          topics: [
            "Literature analysis",
            "Reading strategies",
            "Comprehension skills",
            "Critical thinking",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Grammar for NGSA",
      units: [
        {
          title: "Advanced Grammar",
          topics: [
            "Complex sentence structures",
            "Grammar rules",
            "Language usage",
            "Writing mechanics",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-science",
      subject: { id: "science", name: "Science" },
      title: "Science for NGSA",
      units: [
        {
          title: "Scientific Excellence",
          topics: [
            "Life processes",
            "Physical science",
            "Earth science",
            "Scientific investigation",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Social Studies for NGSA",
      units: [
        {
          title: "Social Sciences",
          topics: [
            "History and geography",
            "Civics and government",
            "Economics basics",
            "Cultural studies",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Vocabulary for NGSA",
      units: [
        {
          title: "Advanced Vocabulary",
          topics: [
            "Academic language",
            "Word origins",
            "Figurative language",
            "Vocabulary strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health Education",
      units: [
        {
          title: "Health and Wellness",
          topics: [
            "Personal development",
            "Social skills",
            "Health awareness",
            "Life skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Phonics Application",
      units: [
        {
          title: "Phonics Skills",
          topics: [
            "Word analysis",
            "Reading strategies",
            "Spelling patterns",
            "Reading fluency",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling for NGSA",
      units: [
        {
          title: "Advanced Spelling",
          topics: [
            "Complex patterns",
            "Word origins",
            "Spelling strategies",
            "Vocabulary building",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Composition for NGSA",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Essay writing",
            "Creative writing",
            "Research writing",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Comprehension for NGSA",
      units: [
        {
          title: "Reading Skills",
          topics: [
            "Critical reading",
            "Text analysis",
            "Inference skills",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Dictation for NGSA",
      units: [
        {
          title: "Dictation Skills",
          topics: [
            "Complex passages",
            "Advanced vocabulary",
            "Writing accuracy",
            "Listening skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Writing for NGSA",
      units: [
        {
          title: "Writing Mastery",
          topics: [
            "Writing styles",
            "Creative expression",
            "Writing conventions",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry and Literature",
      units: [
        {
          title: "Poetry Skills",
          topics: [
            "Poetic forms",
            "Literary devices",
            "Poetry writing",
            "Literature analysis",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Advanced Arts",
      units: [
        {
          title: "Art Mastery",
          topics: [
            "Advanced techniques",
            "Art history",
            "Creative expression",
            "Art appreciation",
          ],
        },
      ],
    },
  ],
};
