/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { Program } from "~/modules/academics/types";
import { GY_NURSERY_YEAR_1_V1 } from "~/modules/data/academics/guyana/programs";
import { findItemById } from "~/modules/data/items";
import { NURSERY_YEAR_1_PHOTOS } from "../../photos";
import { BLCGY_NURSERY_YEAR_1_2025_T1 } from "../cycles";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  BLCGY_NURSERY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
  nurseryProgramHighlights,
} from "./shared";

export const BLCGY_NURSERY_YEAR_1_PROGRAM: Program = {
  id: "blcgy-nursery-year-1",
  slug: "nursery-year-1",
  audience: "parent",
  highlights: nurseryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Skills that prepare for primary school",
  outcome: "Early Literacy & Numeracy",
  description: "Engaging curriculum fostering critical thinking and creativity",
  standardProgramVersion: GY_NURSERY_YEAR_1_V1,
  media: { gallery: NURSERY_YEAR_1_PHOTOS },
  isPopular: true,
  cycles: [BLCGY_NURSERY_YEAR_1_2025_T1],
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_NURSERY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-nursery1-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Phonics and Sound Recognition",
      units: [
        {
          title: "Letter Sounds",
          topics: ["Alphabet sounds", "Beginning sounds", "Blending practice"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling and Word Building",
      units: [
        {
          title: "CVC Words and Practice",
          topics: ["Consonant-vowel-consonant", "Simple word puzzles"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Early Reading Skills",
      units: [
        {
          title: "Sight Words and Picture Books",
          topics: [
            "Picture-word matching",
            "Simple sentences",
            "Reading aloud",
          ],
        },
      ],
    },
    {
      id: "blcgy-nursery1-socialstudies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "People, Places, and Culture",
      units: [
        {
          title: "My Community",
          topics: ["Family roles", "Jobs around us", "National symbols"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-science",
      subject: { id: "early-science", name: "Science" },
      title: "Introduction to Science",
      units: [
        {
          title: "Our Environment",
          topics: ["Living and non-living", "Weather", "Plants"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-math",
      subject: { id: "math", name: "Mathematics" },
      title: "Basic Numbers and Counting",
      units: [
        {
          title: "Numbers 1–10",
          topics: ["Number recognition", "Counting objects", "Simple addition"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Drawing and Expression",
      units: [
        {
          title: "Lines, Shapes, and Scenes",
          topics: ["Free drawing", "Shapes", "Drawing with color"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Early Writing Skills",
      units: [
        {
          title: "Letters and Words",
          topics: ["Letter formation", "Name writing", "Simple words"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-storytelling",
      subject: { id: "language-oral", name: "Storytelling" },
      title: "Oral Expression and Storytelling",
      units: [
        {
          title: "Telling and Retelling",
          topics: ["Personal stories", "Story prompts", "Group retelling"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-colouring",
      subject: { id: "visual-art", name: "Colouring" },
      title: "Colouring Techniques",
      units: [
        {
          title: "Inside the Lines",
          topics: ["Color choices", "Blending", "Pattern coloring"],
        },
      ],
    },
    {
      id: "blcgy-nursery1-craft",
      subject: { id: "creative-craft", name: "Art and Craft" },
      title: "Creative Craft Activities",
      units: [
        {
          title: "Paper and Nature Crafts",
          topics: ["Cutting and gluing", "Leaf and paper crafts"],
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
          item: findItemById("book-animal-friends-level-1a-reader")!,
        },
        {
          item: findItemById("book-animal-friends-level-1a-workbook-1")!,
        },
        {
          item: findItemById("book-animal-friends-level-1a-workbook-2")!,
        },
        {
          item: findItemById("book-animal-friends-level-1a-workbook-3")!,
        },
        { item: findItemById("book-big-easy-coloring")! },
        {
          item: findItemById("book-roraima-nursery-year-1-literacy")!,
        },
        {
          item: findItemById("book-roraima-nursery-year-1-numeracy")!,
        },
        {
          item: findItemById("book-roraima-workbook-1-writing")!,
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
          quantity: 2,
        },
        {
          item: findItemById("supply-drawing-book")!,
          quantity: 1,
        },
        { item: findItemById("supply-pack-letters-numbers")! },
        {
          item: findItemById("supply-cardboard-lg")!,
          quantity: 2,
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
