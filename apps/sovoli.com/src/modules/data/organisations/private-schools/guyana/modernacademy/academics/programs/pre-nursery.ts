/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PRE_NURSERY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_PRE_NURSERY_2025_T1 } from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import { findItemById } from "~/modules/data/items";
import { hydrateProgramCategory } from "~/modules/data/academics/categories";
import {
  MAGY_NURSERY_DEPT_ACTIVITIES,
  magyProgramQuickFacts,
  nurseryProgramHighlights,
} from "./shared";

export const MAGY_PRE_NURSERY_PROGRAM: Program = {
  id: "magy-pre-nursery",
  slug: "pre-nursery",
  name: "Pre-Nursery (Playschool)",
  audience: "parent",
  highlights: nurseryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Play, explore, and grow together",
  outcome: "School Readiness",
  description: "Strong foundational learning in a nurturing environment",
  category: hydrateProgramCategory("nursery-education"),
  courses: [
    {
      id: "magy-pre-nursery-tracing",
      subject: { id: "pre-sensory", name: "Motor Skills" },
      title: "Tracing and Fine Motor Control",
      description:
        "Develop hand-eye coordination and pre-writing skills using tracing and drawing exercises.",
      units: [
        {
          title: "Line and Shape Tracing",
          topics: ["Straight lines", "Curves", "Zigzag", "Basic shapes"],
        },
      ],
    },
    {
      id: "magy-pre-nursery-storytelling",
      subject: { id: "pre-language", name: "Language Development" },
      title: "Storytelling and Oral Expression",
      units: [
        {
          title: "Simple Stories and Role Play",
          topics: ["Picture storytelling", "Emotion expression", "Narration"],
        },
      ],
    },
    {
      id: "magy-pre-nursery-art",
      subject: { id: "pre-creative", name: "Creative Expression" },
      title: "Art and Craft",
      units: [
        {
          title: "Sensory Exploration",
          topics: ["Color mixing", "Hand painting", "Cutting and gluing"],
        },
      ],
    },
    {
      id: "magy-pre-nursery-singing",
      subject: { id: "pre-music", name: "Music & Rhythm" },
      title: "Singing and Rhythm",
      units: [
        {
          title: "Rhymes and Movement",
          topics: ["Call-and-response songs", "Body rhythm games"],
        },
      ],
    },
    {
      id: "magy-pre-nursery-counting",
      subject: { id: "pre-numeracy", name: "Numeracy Awareness" },
      title: "Counting and Early Numbers",
      units: [
        {
          title: "Number Rhymes and Games",
          topics: ["Count to 5", "Finger counting", "Songs with numbers"],
        },
      ],
    },
    {
      id: "magy-pre-nursery-roleplay",
      subject: { id: "pre-social", name: "Social Play" },
      title: "Role Playing",
      units: [
        {
          title: "Dress Up and Imaginative Play",
          topics: ["Shopkeeper", "Doctor", "Family"],
        },
      ],
    },
    {
      id: "magy-pre-nursery-colouring",
      subject: { id: "pre-art", name: "Color Recognition" },
      title: "Colouring",
      units: [
        {
          title: "Color Inside the Lines",
          topics: ["Primary colors", "Patterns", "Crayon handling"],
        },
      ],
    },
  ],
  activities: MAGY_NURSERY_DEPT_ACTIVITIES,
  media: { gallery: PRE_NURSERY_PHOTOS },
  isPopular: true,
  cycles: [MAGY_PRE_NURSERY_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  admission: {
    id: "magy-pre-nursery-admission",
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 2, maxAgeYears: 3 },
      },
    ],
    documents: [
      {
        type: "document",
        name: "Birth Certificate",
        requirement: "required",
      },
    ],
  },
  requirements: [
    {
      name: "Books",
      category: "booklist",
      audience: "parent",
      items: [
        {
          item: findItemById("book-123-starters-coloring")!,
        },
      ],
    },
    {
      name: "Supplies",
      category: "materials",
      audience: "parent",
      items: [
        {
          item: findItemById("supply-crayola-crayons-fat")!,
        },
        { item: findItemById("supply-crayola-play-dough")! },
        { item: findItemById("supply-drawing-book")! },
        { item: findItemById("supply-building-blocks")! },
        { item: findItemById("supply-crayola-paint-6pcs")! },
        {
          item: findItemById("supply-cardboard-lg")!,
          quantity: 2,
          unit: "sheet",
        },
        { item: findItemById("supply-glue-elmers")! },
        { item: findItemById("supply-detergent")! },
        {
          item: findItemById("supply-hand-sanitizer")!,
          unit: "bottle",
        },
        {
          item: findItemById("supply-paper-towel")!,
          quantity: 1,
          unit: "roll",
        },
        {
          item: findItemById("supply-liquid-soap")!,
          unit: "bottle",
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
