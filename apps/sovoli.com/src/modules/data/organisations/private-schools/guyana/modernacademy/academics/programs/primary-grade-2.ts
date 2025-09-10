/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { GY_PRIMARY_GRADE_2_V1 } from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_PRIMARY_GRADE_2_2025_T1 } from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  MAGY_PRIMARY_DEPT_ACTIVITIES,
  magyProgramQuickFacts,
} from "./shared";
import { findItemById } from "~/modules/data/items";

export const MAGY_PRIMARY_GRADE_2_PROGRAM: Program = {
  id: "magy-primary-grade-2",
  slug: "grade-2",
  audience: "parent",
  highlights: primaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_2_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_2_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade2-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Building Mathematics Skills",
      units: [
        {
          title: "Numbers and Operations",
          topics: [
            "Number patterns",
            "Addition and subtraction with regrouping",
            "Multiplication basics",
            "Problem solving",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Developing Reading Skills",
      units: [
        {
          title: "Reading Development",
          topics: [
            "Reading fluency",
            "Comprehension strategies",
            "Vocabulary building",
            "Independent reading",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Grammar Fundamentals",
      units: [
        {
          title: "Grammar Skills",
          topics: [
            "Parts of speech",
            "Sentence structure",
            "Tenses",
            "Grammar rules",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-science",
      subject: { id: "science", name: "Science" },
      title: "Exploring Science",
      units: [
        {
          title: "Scientific Inquiry",
          topics: [
            "Life cycles",
            "Matter and materials",
            "Forces and motion",
            "Scientific method",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Our World",
      units: [
        {
          title: "Geography and History",
          topics: [
            "Maps and globes",
            "Local history",
            "Cultural diversity",
            "Community development",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Expanding Vocabulary",
      units: [
        {
          title: "Word Knowledge",
          topics: [
            "Synonyms and antonyms",
            "Multiple meanings",
            "Word origins",
            "Context clues",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health and Safety",
      units: [
        {
          title: "Healthy Choices",
          topics: [
            "Nutrition",
            "Physical activity",
            "Safety awareness",
            "Emotional health",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Advanced Phonics",
      units: [
        {
          title: "Phonics Mastery",
          topics: [
            "Complex blends",
            "Syllable patterns",
            "Word analysis",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling Mastery",
      units: [
        {
          title: "Spelling Skills",
          topics: [
            "Spelling patterns",
            "Word families",
            "Spelling rules",
            "Vocabulary building",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Writing Development",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Paragraph writing",
            "Story development",
            "Descriptive writing",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Reading Comprehension",
      units: [
        {
          title: "Understanding Text",
          topics: [
            "Main idea and details",
            "Inference skills",
            "Text structure",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Listening and Writing",
      units: [
        {
          title: "Dictation Skills",
          topics: [
            "Listening comprehension",
            "Spelling accuracy",
            "Sentence writing",
            "Writing fluency",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Writing Skills",
      units: [
        {
          title: "Writing Development",
          topics: [
            "Handwriting improvement",
            "Sentence variety",
            "Creative writing",
            "Writing conventions",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry and Creative Writing",
      units: [
        {
          title: "Poetry Skills",
          topics: [
            "Poetic forms",
            "Rhythm and rhyme",
            "Poetry writing",
            "Poetry appreciation",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Creative Arts",
      units: [
        {
          title: "Art Skills",
          topics: [
            "Drawing techniques",
            "Painting skills",
            "Craft projects",
            "Art history",
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
          item: findItemById("supply-art-book")!,
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
