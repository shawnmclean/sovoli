/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GY_NURSERY_YEAR_2_V1 } from "~/modules/data/academics/guyana/programs";
import { NURSERY_YEAR_2_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { BLCGY_NURSERY_YEAR_2_2025_T1 } from "../cycles";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import { findItemById } from "~/modules/data/items";
import {
  BLCGY_NURSERY_DEPT_ACTIVITIES,
  nurseryProgramHighlights,
  blcgyProgramQuickFacts,
} from "./shared";

export const BLCGY_NURSERY_YEAR_2_PROGRAM: Program = {
  id: "blcgy-nursery-year-2",
  slug: "nursery-year-2",
  audience: "parent",
  highlights: nurseryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Advanced skills for primary readiness",
  outcome: "Primary School Readiness",
  description: "Advanced curriculum preparing children for primary school",
  standardProgramVersion: GY_NURSERY_YEAR_2_V1,
  photos: NURSERY_YEAR_2_PHOTOS,
  isPopular: true,
  cycles: [BLCGY_NURSERY_YEAR_2_2025_T1],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_NURSERY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-nursery2-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Advanced Phonics",
      units: [
        {
          title: "Complex Letter Sounds",
          topics: ["Digraphs", "Blends", "Advanced blending"],
        },
      ],
    },
    {
      id: "blcgy-nursery2-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Advanced Spelling",
      units: [
        {
          title: "Complex Words",
          topics: [
            "Multi-syllable words",
            "Spelling patterns",
            "Word families",
          ],
        },
      ],
    },
    {
      id: "blcgy-nursery2-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Advanced Reading Skills",
      units: [
        {
          title: "Reading Comprehension",
          topics: [
            "Story understanding",
            "Character analysis",
            "Plot development",
          ],
        },
      ],
    },
    {
      id: "blcgy-nursery2-socialstudies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Community and Culture",
      units: [
        {
          title: "Our World",
          topics: ["Countries and cultures", "Community helpers", "Traditions"],
        },
      ],
    },
    {
      id: "blcgy-nursery2-science",
      subject: { id: "early-science", name: "Science" },
      title: "Advanced Science",
      units: [
        {
          title: "Scientific Thinking",
          topics: [
            "Observation skills",
            "Simple experiments",
            "Nature studies",
          ],
        },
      ],
    },
    {
      id: "blcgy-nursery2-math",
      subject: { id: "math", name: "Mathematics" },
      title: "Advanced Numbers",
      units: [
        {
          title: "Numbers 1–20",
          topics: [
            "Number recognition",
            "Counting to 20",
            "Simple subtraction",
          ],
        },
      ],
    },
    {
      id: "blcgy-nursery2-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Advanced Art",
      units: [
        {
          title: "Creative Expression",
          topics: ["Advanced drawing", "Color theory", "Art appreciation"],
        },
      ],
    },
    {
      id: "blcgy-nursery2-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Advanced Writing Skills",
      units: [
        {
          title: "Sentence Writing",
          topics: ["Simple sentences", "Capitalization", "Punctuation"],
        },
      ],
    },
    {
      id: "blcgy-nursery2-storytelling",
      subject: { id: "language-oral", name: "Storytelling" },
      title: "Advanced Oral Skills",
      units: [
        {
          title: "Presentation Skills",
          topics: ["Public speaking", "Story creation", "Group discussions"],
        },
      ],
    },
    {
      id: "blcgy-nursery2-craft",
      subject: { id: "creative-craft", name: "Art and Craft" },
      title: "Advanced Crafts",
      units: [
        {
          title: "Complex Projects",
          topics: [
            "Multi-step crafts",
            "3D creations",
            "Collaborative projects",
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
          item: findItemById("book-animal-friends-level-1b-reader")!,
        },
        {
          item: findItemById("book-animal-friends-level-1b-workbook-1")!,
        },
        {
          item: findItemById("book-animal-friends-level-1b-workbook-2")!,
        },
        {
          item: findItemById("book-roraima-nursery-year-2-literacy")!,
        },
        {
          item: findItemById("book-roraima-nursery-year-2-numeracy")!,
        },
        {
          item: findItemById("book-roraima-workbook-2-writing")!,
        },
      ],
    },
    {
      name: "Supplies",
      category: "materials",
      audience: "parent",
      items: [
        { item: findItemById("supply-fat-pencil")! },
        {
          item: findItemById("supply-single-line-book")!,
          quantity: 3,
        },
        {
          item: findItemById("supply-drawing-book")!,
          quantity: 1,
        },
        { item: findItemById("supply-pack-letters-numbers")! },
        {
          item: findItemById("supply-cardboard-lg")!,
          quantity: 3,
          unit: "sheet",
        },
        {
          item: findItemById("supply-pack-blocks")!,
          quantity: 1,
          unit: "pack",
        },
        {
          item: findItemById("supply-crayola-paint-6pcs")!,
          quantity: 1,
          unit: "set",
        },
        {
          item: findItemById("supply-hand-sanitizer")!,
          quantity: 1,
          unit: "bottle",
        },
      ],
    },
  ],
};
