/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { SECONDARY_PHOTOS, shuffleArray } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  secondaryProgramHighlights,
  MAGY_SECONDARY_DEPT_ACTIVITIES,
  magyProgramQuickFacts,
} from "./shared";
import { findItemById } from "~/modules/data/items";

export const MAGY_SECONDARY_GRADE_7_PROGRAM: Program = {
  id: "magy-secondary-grade-7",
  slug: "grade-7",
  audience: "parent",
  name: "Grade 7",
  admission: {
    id: "magy-secondary-grade-7-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 12, maxAgeYears: 13 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Building foundations for CSEC success",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description:
    "Comprehensive secondary education preparing students for CSEC examinations",
  photos: shuffleArray(SECONDARY_PHOTOS),
  cycles: [], // Will be added when cycles are created
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade7-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Secondary Mathematics",
      units: [
        {
          title: "Algebra and Number Theory",
          topics: [
            "Algebraic expressions and equations",
            "Linear and quadratic functions",
            "Number systems and operations",
            "Ratio and proportion",
          ],
        },
        {
          title: "Geometry and Measurement",
          topics: [
            "Properties of shapes and angles",
            "Area and perimeter calculations",
            "Coordinate geometry basics",
            "Transformations",
          ],
        },
      ],
    },
    {
      id: "magy-grade7-english",
      subject: { id: "english", name: "English Language" },
      title: "English Language and Literature",
      units: [
        {
          title: "Reading and Comprehension",
          topics: [
            "Advanced reading strategies",
            "Literary analysis",
            "Critical thinking skills",
            "Text interpretation",
          ],
        },
        {
          title: "Writing and Communication",
          topics: [
            "Essay writing techniques",
            "Creative writing",
            "Formal and informal writing",
            "Grammar and syntax",
          ],
        },
      ],
    },
    {
      id: "magy-grade7-science",
      subject: { id: "science", name: "Integrated Science" },
      title: "Integrated Science",
      units: [
        {
          title: "Physical Sciences",
          topics: [
            "Matter and its properties",
            "Forces and motion",
            "Energy and work",
            "Simple machines",
          ],
        },
        {
          title: "Life Sciences",
          topics: [
            "Cell structure and function",
            "Human body systems",
            "Ecosystems and environment",
            "Classification of living things",
          ],
        },
      ],
    },
    {
      id: "magy-grade7-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Social Studies",
      units: [
        {
          title: "History and Geography",
          topics: [
            "Guyana's history and culture",
            "Caribbean history",
            "Physical and human geography",
            "Environmental issues",
          ],
        },
        {
          title: "Civics and Government",
          topics: [
            "Government systems",
            "Citizenship and rights",
            "Economic systems",
            "Social responsibility",
          ],
        },
      ],
    },
    {
      id: "magy-grade7-spanish",
      subject: { id: "spanish", name: "Spanish" },
      title: "Spanish Language",
      units: [
        {
          title: "Language Fundamentals",
          topics: [
            "Basic vocabulary and phrases",
            "Grammar structures",
            "Pronunciation and accent",
            "Cultural awareness",
          ],
        },
      ],
    },
    {
      id: "magy-grade7-art",
      subject: { id: "art", name: "Visual Arts" },
      title: "Visual Arts",
      units: [
        {
          title: "Art Techniques and Media",
          topics: [
            "Drawing and sketching",
            "Painting techniques",
            "Sculpture and 3D art",
            "Digital art basics",
          ],
        },
      ],
    },
    {
      id: "magy-grade7-physical-education",
      subject: { id: "pe", name: "Physical Education" },
      title: "Physical Education",
      units: [
        {
          title: "Fitness and Health",
          topics: [
            "Physical fitness components",
            "Team sports",
            "Individual activities",
            "Health and wellness",
          ],
        },
      ],
    },
    {
      id: "magy-grade7-computer-studies",
      subject: { id: "computer-studies", name: "Computer Studies" },
      title: "Computer Studies",
      units: [
        {
          title: "Computer Fundamentals",
          topics: [
            "Computer hardware and software",
            "Word processing",
            "Spreadsheets and databases",
            "Internet and digital literacy",
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
          item: findItemById("book-mathematics-made-easy-1")!,
        },
        {
          item: findItemById("book-atlantic-reader-book-1")!,
        },
        {
          item: findItemById(
            "book-process-of-learning-language-arts-infant-first-year",
          )!,
        },
        {
          item: findItemById(
            "book-process-of-learning-composition-writing-infant-first-year",
          )!,
        },
        {
          item: findItemById("book-fun-with-language-book-1-parts-1-2-3")!,
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
          quantity: 20,
          unit: "books",
        },
        {
          item: findItemById("supply-double-line-book")!,
          quantity: 2,
          unit: "books",
        },
        {
          item: findItemById("supply-drawing-book")!,
          quantity: 1,
          unit: "book",
          notes: "A4 size",
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
          quantity: 2,
          unit: "sheets",
        },
        {
          item: findItemById("supply-tissue-paper-towel")!,
          quantity: 1,
          unit: "roll",
        },
        {
          item: findItemById("supply-calculator")!,
          quantity: 1,
          unit: "calculator",
          notes: "Scientific calculator",
        },
      ],
    },
  ],
};
