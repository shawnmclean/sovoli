/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { GY_PRIMARY_GRADE_5_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_PRIMARY_GRADE_5_2025_T1 } from "../cycles";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  BLCGY_PRIMARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
} from "./shared";
import { findItemById } from "~/modules/data/items";

export const BLCGY_PRIMARY_GRADE_5_PROGRAM: Program = {
  id: "blcgy-primary-grade-5",
  slug: "grade-5",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Preparing for NGSA success",
  outcome: "NGSA (Grade 6 Exam)",
  description: "NGSA preparation with comprehensive academic foundation",
  standardProgramVersion: GY_PRIMARY_GRADE_5_V1,
  media: PRIMARY_PHOTOS,
  cycles: [BLCGY_PRIMARY_GRADE_5_2025_T1],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade5-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "NGSA Mathematics",
      units: [
        {
          title: "NGSA Preparation",
          topics: [
            "Advanced number operations",
            "Geometry and measurement",
            "Data handling",
            "NGSA practice tests",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade5-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "NGSA Reading",
      units: [
        {
          title: "Reading Excellence",
          topics: [
            "Advanced comprehension",
            "Literary analysis",
            "Reading strategies",
            "NGSA practice",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade5-science",
      subject: { id: "science", name: "Science" },
      title: "NGSA Science",
      units: [
        {
          title: "Scientific Excellence",
          topics: [
            "Physical sciences",
            "Life sciences",
            "Earth sciences",
            "NGSA preparation",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade5-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "NGSA Social Studies",
      units: [
        {
          title: "Social Studies Mastery",
          topics: [
            "Guyana and Caribbean history",
            "Geography and culture",
            "Government and citizenship",
            "NGSA preparation",
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
          item: findItemById("book-mathematics-made-easy-5")!,
        },
        {
          item: findItemById("book-atlantic-reader-book-5")!,
        },
        {
          item: findItemById(
            "book-process-of-learning-language-arts-junior-third-year",
          )!,
        },
        {
          item: findItemById(
            "book-process-of-learning-composition-writing-junior-third-year",
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
