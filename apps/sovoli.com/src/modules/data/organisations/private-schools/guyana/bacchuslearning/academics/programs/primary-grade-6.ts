/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { GY_PRIMARY_GRADE_6_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_PRIMARY_GRADE_6_2025_T1 } from "../cycles";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  BLCGY_PRIMARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
} from "./shared";
import { findItemById } from "~/modules/data/items";

export const BLCGY_PRIMARY_GRADE_6_PROGRAM: Program = {
  id: "blcgy-primary-grade-6",
  slug: "grade-6",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "NGSA excellence and secondary preparation",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Final primary year with intensive NGSA preparation",
  standardProgramVersion: GY_PRIMARY_GRADE_6_V1,
  media: { gallery: PRIMARY_PHOTOS },
  cycles: [BLCGY_PRIMARY_GRADE_6_2025_T1],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade6-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "NGSA Mathematics Excellence",
      units: [
        {
          title: "NGSA Mastery",
          topics: [
            "Comprehensive number operations",
            "Advanced geometry",
            "Statistics and probability",
            "NGSA exam techniques",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade6-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "NGSA Reading Excellence",
      units: [
        {
          title: "Reading Mastery",
          topics: [
            "Advanced comprehension",
            "Critical analysis",
            "Exam strategies",
            "NGSA practice",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade6-science",
      subject: { id: "science", name: "Science" },
      title: "NGSA Science",
      units: [
        {
          title: "Scientific Mastery",
          topics: [
            "Integrated science concepts",
            "Scientific method",
            "Practical applications",
            "NGSA preparation",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade6-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "NGSA Social Studies Excellence",
      units: [
        {
          title: "Social Studies Mastery",
          topics: [
            "Comprehensive history",
            "Geography mastery",
            "Civic responsibility",
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
          item: findItemById("book-mathematics-made-easy-6")!,
        },
        {
          item: findItemById("book-atlantic-reader-book-6")!,
        },
        {
          item: findItemById(
            "book-process-of-learning-language-arts-junior-fourth-year",
          )!,
        },
        {
          item: findItemById(
            "book-process-of-learning-composition-writing-junior-fourth-year",
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
