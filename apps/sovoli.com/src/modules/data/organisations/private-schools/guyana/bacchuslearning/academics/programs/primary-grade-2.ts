/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { GY_PRIMARY_GRADE_2_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_PRIMARY_GRADE_2_2025_T1 } from "../cycles";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  BLCGY_PRIMARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
} from "./shared";
import { findItemById } from "~/modules/data/items";

export const BLCGY_PRIMARY_GRADE_2_PROGRAM: Program = {
  id: "blcgy-primary-grade-2",
  slug: "grade-2",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Building on strong foundations",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Continued development of core academic skills",
  standardProgramVersion: GY_PRIMARY_GRADE_2_V1,
  media: { gallery: PRIMARY_PHOTOS },
  cycles: [BLCGY_PRIMARY_GRADE_2_2025_T1],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade2-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Advanced Mathematics",
      units: [
        {
          title: "Numbers and Operations",
          topics: [
            "Number recognition 1-200",
            "Addition and subtraction with regrouping",
            "Place value to hundreds",
            "Word problems",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade2-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Advanced Reading Skills",
      units: [
        {
          title: "Reading Development",
          topics: [
            "Advanced sight words",
            "Reading fluency",
            "Comprehension strategies",
            "Independent reading",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade2-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Advanced Grammar",
      units: [
        {
          title: "Grammar Development",
          topics: [
            "Parts of speech",
            "Sentence structure",
            "Punctuation rules",
            "Grammar in context",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade2-science",
      subject: { id: "science", name: "Science" },
      title: "Advanced Science",
      units: [
        {
          title: "Scientific Inquiry",
          topics: [
            "Living and non-living things",
            "Plant and animal life cycles",
            "Weather and seasons",
            "Simple experiments",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade2-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Community Studies",
      units: [
        {
          title: "Our World",
          topics: [
            "Local and national geography",
            "Cultural diversity",
            "Community services",
            "Historical events",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade2-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Creative Arts",
      units: [
        {
          title: "Art Development",
          topics: [
            "Advanced drawing techniques",
            "Color theory",
            "Art history",
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
          item: findItemById("book-mathematics-made-easy-2")!,
        },
        {
          item: findItemById("book-atlantic-reader-book-2")!,
        },
        {
          item: findItemById(
            "book-process-of-learning-language-arts-infant-second-year",
          )!,
        },
        {
          item: findItemById(
            "book-process-of-learning-composition-writing-infant-second-year",
          )!,
        },
        {
          item: findItemById("book-fun-with-language-book-2-parts-1-2-3")!,
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
