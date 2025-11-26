/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { GY_PRIMARY_GRADE_3_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS, shuffleArray } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_PRIMARY_GRADE_3_2025_T1 } from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  MAGY_PRIMARY_DEPT_ACTIVITIES,
  magyProgramQuickFacts,
} from "./shared";
import { findItemById } from "~/modules/data/items";

export const MAGY_PRIMARY_GRADE_3_PROGRAM: Program = {
  id: "magy-primary-grade-3",
  slug: "grade-3",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_3_V1,
  media: shuffleArray(PRIMARY_PHOTOS),
  cycles: [MAGY_PRIMARY_GRADE_3_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade3-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Intermediate Mathematics",
      units: [
        {
          title: "Mathematical Operations",
          topics: [
            "Multiplication and division",
            "Fractions basics",
            "Measurement",
            "Geometry concepts",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Advanced Reading Skills",
      units: [
        {
          title: "Reading Mastery",
          topics: [
            "Reading strategies",
            "Comprehension skills",
            "Literature appreciation",
            "Critical thinking",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Grammar Application",
      units: [
        {
          title: "Grammar Skills",
          topics: [
            "Advanced parts of speech",
            "Sentence variety",
            "Punctuation mastery",
            "Grammar usage",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-science",
      subject: { id: "science", name: "Science" },
      title: "Scientific Discovery",
      units: [
        {
          title: "Science Exploration",
          topics: [
            "Ecosystems",
            "Energy and matter",
            "Simple machines",
            "Scientific investigation",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "World Studies",
      units: [
        {
          title: "Global Perspectives",
          topics: [
            "World geography",
            "Cultural studies",
            "Historical events",
            "Global citizenship",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Advanced Vocabulary",
      units: [
        {
          title: "Word Mastery",
          topics: [
            "Academic vocabulary",
            "Word relationships",
            "Figurative language",
            "Word analysis",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health and Wellness",
      units: [
        {
          title: "Healthy Living",
          topics: [
            "Mental health",
            "Social skills",
            "Conflict resolution",
            "Healthy relationships",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Phonics Mastery",
      units: [
        {
          title: "Advanced Phonics",
          topics: [
            "Complex word patterns",
            "Syllable division",
            "Word analysis",
            "Reading fluency",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Advanced Spelling",
      units: [
        {
          title: "Spelling Mastery",
          topics: [
            "Complex spelling patterns",
            "Word origins",
            "Spelling strategies",
            "Vocabulary building",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Advanced Writing",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Essay writing",
            "Creative writing",
            "Research skills",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-comprehension",
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
      id: "magy-grade3-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Advanced Dictation",
      units: [
        {
          title: "Dictation Skills",
          topics: [
            "Complex sentences",
            "Advanced vocabulary",
            "Writing accuracy",
            "Listening skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-writing",
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
      id: "magy-grade3-poetry",
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
      id: "magy-grade3-art",
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
  requirements: [
    {
      name: "Books",
      category: "booklist",
      audience: "parent",
      items: [
        {
          item: findItemById("book-social-studies-for-our-children-book-3")!,
        },
        {
          item: findItemById("book-science-around-us-book-3")!,
        },
        {
          item: findItemById("book-fun-with-language-book-3")!,
        },
        {
          item: findItemById("book-lets-do-mathematics-book-3")!,
        },
        {
          item: findItemById("book-step-to-common-entrance-book-1")!,
        },
        {
          item: findItemById("book-word-perfect-spelling-book-3")!,
        },
        {
          item: findItemById("book-nelson-west-indian-readers-book-2")!,
        },
        {
          item: findItemById("book-rainbow-readers-book-3")!,
        },
        {
          item: findItemById("book-oxford-primary-school-dictionary")!,
        },
      ],
    },
    {
      name: "Supplies",
      category: "materials",
      audience: "parent",
      items: [
        {
          item: findItemById("supply-exercise-book-big")!,
          quantity: 15,
          unit: "books",
        },
        {
          item: findItemById("supply-double-line-book")!,
          quantity: 1,
          unit: "book",
        },
        {
          item: findItemById("supply-drawing-book")!,
          quantity: 1,
          unit: "book",
          notes: "Crayola",
        },
        {
          item: findItemById("supply-soap")!,
          quantity: 1,
          unit: "bar",
        },
        {
          item: findItemById("supply-detergent")!,
          quantity: 1,
          unit: "bottle",
        },
        {
          item: findItemById("supply-hand-sanitizer")!,
          quantity: 1,
          unit: "bottle",
        },
        {
          item: findItemById("supply-bounty-tissue")!,
          quantity: 1,
          unit: "roll",
        },
        {
          item: findItemById("supply-toilet-paper")!,
          quantity: 1,
          unit: "roll",
        },
      ],
    },
  ],
};
