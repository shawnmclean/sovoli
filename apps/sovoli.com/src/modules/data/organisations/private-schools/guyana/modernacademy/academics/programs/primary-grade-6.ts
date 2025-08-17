import { GY_PRIMARY_GRADE_6_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_PRIMARY_GRADE_6_2025_T1 } from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  MAGY_PRIMARY_DEPT_ACTIVITIES,
} from "./shared";

export const MAGY_PRIMARY_GRADE_6_PROGRAM: Program = {
  id: "magy-primary-grade-6",
  slug: "grade-6",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_6_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_6_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade6-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "NGSA Mathematics",
      units: [
        {
          title: "NGSA Preparation",
          topics: [
            "Advanced operations",
            "Geometry and measurement",
            "Data analysis",
            "Problem solving strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "NGSA Reading",
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
      id: "magy-grade6-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "NGSA Grammar",
      units: [
        {
          title: "Grammar Mastery",
          topics: [
            "Advanced grammar",
            "Language usage",
            "Writing mechanics",
            "Grammar application",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-science",
      subject: { id: "science", name: "Science" },
      title: "NGSA Science",
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
      id: "magy-grade6-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "NGSA Social Studies",
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
      id: "magy-grade6-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "NGSA Vocabulary",
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
      id: "magy-grade6-health",
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
      id: "magy-grade6-phonics",
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
      id: "magy-grade6-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "NGSA Spelling",
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
      id: "magy-grade6-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "NGSA Composition",
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
      id: "magy-grade6-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "NGSA Comprehension",
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
      id: "magy-grade6-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "NGSA Dictation",
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
      id: "magy-grade6-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "NGSA Writing",
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
      id: "magy-grade6-poetry",
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
      id: "magy-grade6-art",
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
