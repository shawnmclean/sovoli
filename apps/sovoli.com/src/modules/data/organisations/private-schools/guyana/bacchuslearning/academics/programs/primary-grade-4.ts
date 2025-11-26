/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { GY_PRIMARY_GRADE_4_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_PRIMARY_GRADE_4_2025_T1 } from "../cycles";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  BLCGY_PRIMARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
} from "./shared";
import { findItemById } from "~/modules/data/items";

export const BLCGY_PRIMARY_GRADE_4_PROGRAM: Program = {
  id: "blcgy-primary-grade-4",
  slug: "grade-4",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Advanced primary skills",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Advanced primary education preparing for NGSA",
  standardProgramVersion: GY_PRIMARY_GRADE_4_V1,
  media: PRIMARY_PHOTOS,
  cycles: [BLCGY_PRIMARY_GRADE_4_2025_T1],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade4-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Advanced Mathematics",
      units: [
        {
          title: "Numbers and Operations",
          topics: [
            "Large numbers",
            "Advanced multiplication and division",
            "Decimals introduction",
            "Complex problem solving",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade4-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Advanced Reading",
      units: [
        {
          title: "Reading Mastery",
          topics: [
            "Complex comprehension",
            "Literary analysis",
            "Reading fluency",
            "Critical evaluation",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade4-science",
      subject: { id: "science", name: "Science" },
      title: "Advanced Science",
      units: [
        {
          title: "Scientific Understanding",
          topics: [
            "Physical sciences",
            "Life sciences",
            "Earth sciences",
            "Scientific investigation",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade4-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Advanced Social Studies",
      units: [
        {
          title: "Society and Culture",
          topics: [
            "Caribbean history",
            "Government systems",
            "Economic concepts",
            "Social responsibility",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade4-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Advanced Visual Arts",
      units: [
        {
          title: "Art Mastery",
          topics: [
            "Advanced techniques",
            "Art criticism",
            "Cultural art forms",
            "Creative projects",
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
          item: findItemById("book-mathematics-made-easy-4")!,
        },
        {
          item: findItemById("book-atlantic-reader-book-4")!,
        },
        {
          item: findItemById(
            "book-process-of-learning-language-arts-junior-second-year",
          )!,
        },
        {
          item: findItemById(
            "book-process-of-learning-composition-writing-junior-second-year",
          )!,
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
          item: findItemById("supply-cardboard-lg")!,
          quantity: 1,
          unit: "sheet",
        },
        {
          item: findItemById("supply-tissue-paper-towel")!,
          quantity: 1,
          unit: "roll",
        },
      ],
    },
  ],
};
