import { GY_PRIMARY_GRADE_4_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_PRIMARY_GRADE_4_2025_T1 } from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  MAGY_PRIMARY_DEPT_ACTIVITIES,
} from "./shared";

export const MAGY_PRIMARY_GRADE_4_PROGRAM: Program = {
  id: "magy-primary-grade-4",
  slug: "grade-4",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_4_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_4_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade4-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Upper Primary Mathematics",
      units: [
        {
          title: "Advanced Operations",
          topics: [
            "Fractions and decimals",
            "Geometry and measurement",
            "Data handling",
            "Problem solving",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Reading Excellence",
      units: [
        {
          title: "Reading Mastery",
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
      id: "magy-grade4-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Grammar Mastery",
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
      id: "magy-grade4-science",
      subject: { id: "science", name: "Science" },
      title: "Advanced Science",
      units: [
        {
          title: "Scientific Investigation",
          topics: [
            "Life processes",
            "Physical science",
            "Earth science",
            "Scientific method",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Advanced Social Studies",
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
      id: "magy-grade4-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Vocabulary Excellence",
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
      id: "magy-grade4-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Advanced Health Education",
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
      id: "magy-grade4-phonics",
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
      id: "magy-grade4-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling Excellence",
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
      id: "magy-grade4-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Advanced Composition",
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
      id: "magy-grade4-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Advanced Comprehension",
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
      id: "magy-grade4-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Advanced Dictation",
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
      id: "magy-grade4-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Writing Excellence",
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
      id: "magy-grade4-poetry",
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
      id: "magy-grade4-art",
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
