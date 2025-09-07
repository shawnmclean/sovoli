/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NURSERY_YEAR_2_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { findItemById } from "~/modules/data/items";
import {
  APPLETON_NURSERY_DEPT_ACTIVITIES,
  nurseryProgramHighlights,
  appletonProgramQuickFacts,
} from "./shared";

export const APPLETON_NURSERY_YEAR_2_PROGRAM: Program = {
  id: "appleton-nursery-year-2",
  name: "Nursery Year 2",
  slug: "nursery-year-2",
  audience: "parent",
  highlights: nurseryProgramHighlights,
  quickFacts: appletonProgramQuickFacts,
  tagline: "Preparing for primary school success",
  outcome: "School Readiness & Independence",
  description:
    "Advanced learning experiences that prepare children for the transition to primary school",
  standardProgramVersion: undefined, // Will be updated when Jamaica's ministry information is added
  photos: NURSERY_YEAR_2_PHOTOS,
  isPopular: true,
  cycles: [], // Will be added when cycles are created
  testimonials: [], // Will be added when testimonials are collected
  activities: APPLETON_NURSERY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "appleton-nursery2-reading",
      subject: { id: "reading-readiness", name: "Reading Readiness" },
      title: "Pre-Reading Skills",
      units: [
        {
          title: "Phonics and Word Recognition",
          topics: ["Letter sounds", "Sight words", "Simple sentences"],
        },
      ],
    },
    {
      id: "appleton-nursery2-writing",
      subject: { id: "writing-readiness", name: "Writing Readiness" },
      title: "Pre-Writing Skills",
      units: [
        {
          title: "Letter Formation",
          topics: ["Tracing letters", "Name writing", "Drawing shapes"],
        },
      ],
    },
    {
      id: "appleton-nursery2-math",
      subject: { id: "early-math", name: "Early Mathematics" },
      title: "Numbers and Patterns",
      units: [
        {
          title: "Numbers 1-20",
          topics: ["Counting", "Number recognition", "Simple addition"],
        },
      ],
    },
    {
      id: "appleton-nursery2-science",
      subject: { id: "early-science", name: "Early Science" },
      title: "Exploring the World",
      units: [
        {
          title: "Nature and Environment",
          topics: ["Plants and animals", "Weather", "Five senses"],
        },
      ],
    },
    {
      id: "appleton-nursery2-social",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Community and Culture",
      units: [
        {
          title: "Our Community",
          topics: ["Family", "Friends", "Jamaican culture"],
        },
      ],
    },
    {
      id: "appleton-nursery2-independence",
      subject: { id: "life-skills", name: "Life Skills" },
      title: "Independence and Self-Care",
      units: [
        {
          title: "Daily Routines",
          topics: [
            "Personal hygiene",
            "Following schedules",
            "Problem solving",
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
          item: findItemById("book-animal-readers")!,
        },
        {
          item: findItemById("book-coloring-book")!,
        },
      ],
    },
    {
      name: "Supplies",
      category: "materials",
      audience: "parent",
      items: [
        { item: findItemById("supply-crayola-crayons")! },
        {
          item: findItemById("supply-art-book")!,
          quantity: 1,
        },
        {
          item: findItemById("supply-fine-line-book")!,
          quantity: 1,
        },
        {
          item: findItemById("supply-pencils")!,
          quantity: 2,
          unit: "each",
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
