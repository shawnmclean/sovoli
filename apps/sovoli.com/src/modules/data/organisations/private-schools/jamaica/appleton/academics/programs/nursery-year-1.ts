/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NURSERY_YEAR_1_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { findItemById } from "~/modules/data/items";
import {
  APPLETON_NURSERY_DEPT_ACTIVITIES,
  nurseryProgramHighlights,
  appletonProgramQuickFacts,
} from "./shared";

export const APPLETON_NURSERY_YEAR_1_PROGRAM: Program = {
  id: "appleton-nursery-year-1",
  name: "Nursery Year 1",
  slug: "nursery-year-1",
  audience: "parent",
  highlights: nurseryProgramHighlights,
  quickFacts: appletonProgramQuickFacts,
  tagline: "Building foundations for lifelong learning",
  outcome: "Early Literacy & Social Skills",
  description:
    "A nurturing environment where children develop essential skills through play and exploration",
  standardProgramVersion: undefined, // Will be updated when Jamaica's ministry information is added
  photos: NURSERY_YEAR_1_PHOTOS,
  isPopular: true,
  cycles: [], // Will be added when cycles are created
  testimonials: [], // Will be added when testimonials are collected
  activities: APPLETON_NURSERY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "appleton-nursery1-language",
      subject: { id: "language-development", name: "Language Development" },
      title: "Early Language Skills",
      units: [
        {
          title: "Speaking and Listening",
          topics: [
            "Vocabulary building",
            "Following instructions",
            "Expressing needs",
          ],
        },
      ],
    },
    {
      id: "appleton-nursery1-phonics",
      subject: { id: "phonics", name: "Phonics" },
      title: "Introduction to Sounds",
      units: [
        {
          title: "Letter Recognition",
          topics: ["Alphabet sounds", "Beginning sounds", "Rhyming words"],
        },
      ],
    },
    {
      id: "appleton-nursery1-math",
      subject: { id: "early-math", name: "Early Mathematics" },
      title: "Numbers and Counting",
      units: [
        {
          title: "Numbers 1-10",
          topics: ["Number recognition", "Counting objects", "Basic shapes"],
        },
      ],
    },
    {
      id: "appleton-nursery1-social",
      subject: { id: "social-skills", name: "Social Skills" },
      title: "Social and Emotional Development",
      units: [
        {
          title: "Making Friends",
          topics: ["Sharing", "Taking turns", "Following rules"],
        },
      ],
    },
    {
      id: "appleton-nursery1-creative",
      subject: { id: "creative-arts", name: "Creative Arts" },
      title: "Art and Creativity",
      units: [
        {
          title: "Drawing and Painting",
          topics: ["Free expression", "Color recognition", "Fine motor skills"],
        },
      ],
    },
    {
      id: "appleton-nursery1-physical",
      subject: { id: "physical-development", name: "Physical Development" },
      title: "Gross and Fine Motor Skills",
      units: [
        {
          title: "Movement and Coordination",
          topics: ["Running and jumping", "Balance", "Hand-eye coordination"],
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
          item: findItemById("book-animal-friends-level-a-reader")!,
        },
        {
          item: findItemById("book-big-easy-coloring")!,
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
        {
          item: findItemById("supply-paint-set")!,
          notes: "Crayola",
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
