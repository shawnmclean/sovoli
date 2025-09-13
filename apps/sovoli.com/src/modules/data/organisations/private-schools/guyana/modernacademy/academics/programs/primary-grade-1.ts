/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { GY_PRIMARY_GRADE_1_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS, shuffleArray } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_PRIMARY_GRADE_1_2025_T1 } from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  MAGY_PRIMARY_DEPT_ACTIVITIES,
  magyProgramQuickFacts,
} from "./shared";
import { findItemById } from "~/modules/data/items";

export const MAGY_PRIMARY_GRADE_1_PROGRAM: Program = {
  id: "magy-primary-grade-1",
  slug: "grade-1",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_1_V1,
  photos: shuffleArray(PRIMARY_PHOTOS),
  cycles: [MAGY_PRIMARY_GRADE_1_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade1-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Foundation Mathematics",
      units: [
        {
          title: "Numbers and Operations",
          topics: [
            "Number recognition 1-100",
            "Addition and subtraction",
            "Place value",
            "Simple word problems",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Early Reading Skills",
      units: [
        {
          title: "Reading Fundamentals",
          topics: [
            "Sight words",
            "Phonics review",
            "Reading comprehension",
            "Fluency practice",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Basic Grammar",
      units: [
        {
          title: "Grammar Basics",
          topics: [
            "Nouns and verbs",
            "Simple sentences",
            "Capitalization",
            "Punctuation",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-science",
      subject: { id: "science", name: "Science" },
      title: "Introduction to Science",
      units: [
        {
          title: "Living Things and Environment",
          topics: [
            "Plants and animals",
            "Basic needs",
            "Weather patterns",
            "Simple experiments",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Community and Culture",
      units: [
        {
          title: "Our Community",
          topics: [
            "Family and community",
            "Local geography",
            "Cultural celebrations",
            "Community helpers",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Word Building",
      units: [
        {
          title: "Vocabulary Development",
          topics: [
            "New words",
            "Word meanings",
            "Context clues",
            "Word families",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health and Wellness",
      units: [
        {
          title: "Healthy Living",
          topics: [
            "Personal hygiene",
            "Healthy eating",
            "Exercise",
            "Safety rules",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Advanced Phonics",
      units: [
        {
          title: "Phonics Skills",
          topics: [
            "Blends and digraphs",
            "Long and short vowels",
            "Word patterns",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling Skills",
      units: [
        {
          title: "Spelling Patterns",
          topics: [
            "High-frequency words",
            "Phonetic spelling",
            "Spelling rules",
            "Word practice",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Creative Writing",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Sentence writing",
            "Story creation",
            "Descriptive writing",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Reading Comprehension",
      units: [
        {
          title: "Understanding Text",
          topics: [
            "Main idea",
            "Details and facts",
            "Making predictions",
            "Drawing conclusions",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Listening and Writing",
      units: [
        {
          title: "Dictation Practice",
          topics: [
            "Listening skills",
            "Spelling accuracy",
            "Sentence structure",
            "Writing speed",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Handwriting and Writing",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Letter formation",
            "Neat handwriting",
            "Writing sentences",
            "Creative expression",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry Appreciation",
      units: [
        {
          title: "Poetry Basics",
          topics: [
            "Rhyming words",
            "Poem structure",
            "Reading poetry",
            "Simple poetry writing",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Creative Arts",
      units: [
        {
          title: "Art Expression",
          topics: [
            "Drawing techniques",
            "Color mixing",
            "Craft projects",
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
