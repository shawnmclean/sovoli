/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GY_NURSERY_YEAR_2_V1 } from "~/modules/data/academics/guyana/programs";
import { NURSERY_YEAR_2_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_NURSERY_YEAR_2_2025_T1 } from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import { findItemById } from "~/modules/data/items";
import {
  MAGY_NURSERY_DEPT_ACTIVITIES,
  nurseryProgramHighlights,
  magyProgramQuickFacts,
} from "./shared";

export const MAGY_NURSERY_YEAR_2_PROGRAM: Program = {
  id: "magy-nursery-year-2",
  slug: "nursery-year-2",
  audience: "parent",
  highlights: nurseryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Advanced skills for primary school readiness",
  outcome: "Early Literacy & Numeracy",
  description: "Engaging curriculum fostering critical thinking and creativity",
  standardProgramVersion: GY_NURSERY_YEAR_2_V1,
  media: NURSERY_YEAR_2_PHOTOS,
  isPopular: true,
  cycles: [MAGY_NURSERY_YEAR_2_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_NURSERY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-nursery2-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Phonics and Blending",
      units: [
        {
          title: "Blends and Digraphs",
          topics: ["sh, ch, th sounds", "Blending simple words", "Sight words"],
        },
      ],
    },
    {
      id: "magy-nursery2-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Reading and Comprehension",
      units: [
        {
          title: "Short Stories and Sentences",
          topics: [
            "Reading aloud",
            "Picture comprehension",
            "Word recognition",
          ],
        },
      ],
    },
    {
      id: "magy-nursery2-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry and Rhymes",
      units: [
        {
          title: "Memorization and Recital",
          topics: ["Simple poems", "Action rhymes", "Reciting with expression"],
        },
      ],
    },
    {
      id: "magy-nursery2-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Basic Grammar",
      units: [
        {
          title: "Sentence Building",
          topics: ["Nouns and verbs", "Pronouns", "Simple sentence rules"],
        },
      ],
    },
    {
      id: "magy-nursery2-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling and Word Lists",
      units: [
        {
          title: "Weekly Spelling Practice",
          topics: ["Word families", "High-frequency words"],
        },
      ],
    },
    {
      id: "magy-nursery2-math",
      subject: { id: "numeracy", name: "Mathematics" },
      title: "Numbers and Early Operations",
      units: [
        {
          title: "Addition and Subtraction",
          topics: [
            "Numbers 1–20",
            "Counting by 2s and 5s",
            "Shapes and patterns",
          ],
        },
      ],
    },
    {
      id: "magy-nursery2-socialstudies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Understanding My World",
      units: [
        {
          title: "Community and Culture",
          topics: ["Local traditions", "People who help us", "Festivals"],
        },
      ],
    },
    {
      id: "magy-nursery2-science",
      subject: { id: "early-science", name: "Science" },
      title: "Exploring Science",
      units: [
        {
          title: "Basic Experiments",
          topics: ["States of matter", "Seasons", "Animal groups"],
        },
      ],
    },
    {
      id: "magy-nursery2-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Creative and Structured Writing",
      units: [
        {
          title: "Sentence Formation",
          topics: ["Writing simple stories", "Describing pictures"],
        },
      ],
    },
    {
      id: "magy-nursery2-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Art and Drawing",
      units: [
        {
          title: "Creative Projects",
          topics: ["Sketching", "Color blending", "Free expression"],
        },
      ],
    },
    {
      id: "magy-nursery2-numeracy",
      subject: { id: "numeracy-awareness", name: "Numeracy" },
      title: "Practical Numeracy",
      units: [
        {
          title: "Everyday Numbers",
          topics: ["Counting money", "Simple measurement"],
        },
      ],
    },
    {
      id: "magy-nursery2-literacy",
      subject: { id: "language-literacy", name: "Literacy" },
      title: "Language and Vocabulary",
      units: [
        {
          title: "Building Vocabulary",
          topics: ["Synonyms", "Opposites", "New words"],
        },
      ],
    },
    {
      id: "magy-nursery2-discussion",
      subject: { id: "social-communication", name: "Class Discussion" },
      title: "Interactive Class Discussion",
      units: [
        {
          title: "Group Conversations",
          topics: ["Show and tell", "Answering questions", "Sharing ideas"],
        },
      ],
    },
    {
      id: "magy-nursery2-storytime",
      subject: { id: "language-oral", name: "Story Time" },
      title: "Listening and Retelling",
      units: [
        {
          title: "Comprehension Through Stories",
          topics: ["Moral stories", "Sequencing events", "Character recall"],
        },
      ],
    },
    {
      id: "magy-nursery2-colouring",
      subject: { id: "visual-art", name: "Colouring" },
      title: "Colouring Skills",
      units: [
        {
          title: "Advanced Colouring",
          topics: ["Shading", "Pattern coloring", "Creative color use"],
        },
      ],
    },
    {
      id: "magy-nursery2-craft",
      subject: { id: "creative-craft", name: "Art and Craft" },
      title: "Craft and Hands-On Projects",
      units: [
        {
          title: "Advanced Craft",
          topics: ["Origami basics", "Clay modeling", "Holiday crafts"],
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
        { item: findItemById("book-animal-friends-level-1a-reader")! },
        {
          item: findItemById("book-roraima-numeracy-workbook-book-2")!,
        },
        {
          item: findItemById("book-roraima-literacy-nursery-year-2")!,
        },
        { item: findItemById("book-big-easy-coloring")! }, // treated as an exercise book
      ],
    },
    {
      name: "Supplies",
      category: "materials",
      audience: "parent",
      items: [
        { item: findItemById("supply-crayola-crayons-fine")! },
        {
          item: findItemById("supply-drawing-book")!,
          quantity: 1,
        }, // drawing pad / sketch book
        {
          item: findItemById("supply-exercise-book-small-fine-line")!,
          quantity: 1,
        }, // copybook with fine ruling
        {
          item: findItemById("supply-4-line-book")!,
          quantity: 1,
        }, // early-writing copybook
        {
          item: findItemById("supply-pencils-pack-12")!,
          quantity: 2,
          unit: "pack",
        },
        {
          item: findItemById("supply-cardboard-sml")!,
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
        { item: findItemById("supply-soap")!, quantity: 1 }, // unit unspecified on sheet
        { item: findItemById("supply-detergent")!, quantity: 1 }, // unit unspecified on sheet
        {
          item: findItemById("supply-hand-sanitizer")!,
          quantity: 1,
          unit: "bottle",
        },
        {
          item: findItemById("supply-bounty-tissue")!,
          quantity: 1,
          unit: "roll",
          notes: "brand: Bounty",
        },
        {
          item: findItemById("supply-toilet-paper")!,
          quantity: 1,
          unit: "roll",
        },
      ],
    },
  ],
};
