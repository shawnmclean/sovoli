/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { Program } from "~/modules/academics/types";
import { GY_PRIMARY_GRADE_3_V1 } from "~/modules/data/academics/guyana/programs";
import { findItemById } from "~/modules/data/items";
import { PRIMARY_PHOTOS } from "../../photos";
import { BLCGY_PRIMARY_GRADE_3_2025_T1 } from "../cycles";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  BLCGY_PRIMARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
  primaryProgramHighlights,
} from "./shared";

export const BLCGY_PRIMARY_GRADE_3_PROGRAM: Program = {
  id: "blcgy-primary-grade-3",
  slug: "grade-3",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Intermediate learning and growth",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Intermediate skills development for academic success",
  standardProgramVersion: GY_PRIMARY_GRADE_3_V1,
  media: { gallery: PRIMARY_PHOTOS },
  cycles: [BLCGY_PRIMARY_GRADE_3_2025_T1],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade3-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Intermediate Mathematics",
      units: [
        {
          title: "Numbers and Operations",
          topics: [
            "Number recognition 1-1000",
            "Multiplication and division",
            "Fractions basics",
            "Problem solving",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade3-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Intermediate Reading",
      units: [
        {
          title: "Reading Skills",
          topics: [
            "Advanced comprehension",
            "Reading strategies",
            "Literature appreciation",
            "Critical thinking",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade3-science",
      subject: { id: "science", name: "Science" },
      title: "Intermediate Science",
      units: [
        {
          title: "Scientific Concepts",
          topics: [
            "Matter and materials",
            "Forces and motion",
            "Earth and space",
            "Scientific method",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade3-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Social Studies",
      units: [
        {
          title: "Our Society",
          topics: [
            "Guyana's history",
            "Government and citizenship",
            "Economics basics",
            "Cultural heritage",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade3-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Visual Arts",
      units: [
        {
          title: "Art Techniques",
          topics: [
            "Drawing and painting",
            "Sculpture basics",
            "Art history",
            "Creative expression",
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
          item: findItemById("book-mathematics-made-easy-3")!,
        },
        {
          item: findItemById("book-atlantic-reader-book-3")!,
        },
        {
          item: findItemById(
            "book-process-of-learning-language-arts-junior-first-year",
          )!,
        },
        {
          item: findItemById(
            "book-process-of-learning-composition-writing-junior-first-year",
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
