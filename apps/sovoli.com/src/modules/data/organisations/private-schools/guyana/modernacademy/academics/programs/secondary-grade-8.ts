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

export const MAGY_SECONDARY_GRADE_8_PROGRAM: Program = {
  id: "magy-secondary-grade-8",
  slug: "grade-8",
  audience: "parent",
  name: "Grade 8",
  admission: {
    id: "magy-secondary-grade-7-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 13, maxAgeYears: 14 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Advancing towards CSEC excellence",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description:
    "Advanced secondary education building towards CSEC examination preparation",
  photos: shuffleArray(SECONDARY_PHOTOS),
  cycles: [], // Will be added when cycles are created
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade8-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Advanced Mathematics",
      units: [
        {
          title: "Advanced Algebra",
          topics: [
            "Quadratic equations and functions",
            "Polynomials and factoring",
            "Systems of equations",
            "Inequalities and absolute values",
          ],
        },
        {
          title: "Geometry and Trigonometry",
          topics: [
            "Advanced geometric properties",
            "Trigonometric ratios",
            "Circle theorems",
            "Coordinate geometry",
          ],
        },
        {
          title: "Statistics and Probability",
          topics: [
            "Data collection and analysis",
            "Measures of central tendency",
            "Probability concepts",
            "Graphical representations",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-english",
      subject: { id: "english", name: "English Language" },
      title: "Advanced English Language and Literature",
      units: [
        {
          title: "Literature Analysis",
          topics: [
            "Poetry analysis and interpretation",
            "Prose and drama study",
            "Literary devices and techniques",
            "Critical essay writing",
          ],
        },
        {
          title: "Advanced Writing Skills",
          topics: [
            "Argumentative and persuasive writing",
            "Research and report writing",
            "Creative and narrative writing",
            "Grammar and style refinement",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-physics",
      subject: { id: "physics", name: "Physics" },
      title: "Physics",
      units: [
        {
          title: "Mechanics",
          topics: [
            "Motion and forces",
            "Work, energy, and power",
            "Simple harmonic motion",
            "Momentum and collisions",
          ],
        },
        {
          title: "Waves and Sound",
          topics: [
            "Wave properties and behavior",
            "Sound waves and frequency",
            "Light and electromagnetic waves",
            "Optics and reflection",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-chemistry",
      subject: { id: "chemistry", name: "Chemistry" },
      title: "Chemistry",
      units: [
        {
          title: "Atomic Structure and Bonding",
          topics: [
            "Atomic theory and structure",
            "Chemical bonding",
            "Periodic table trends",
            "Molecular geometry",
          ],
        },
        {
          title: "Chemical Reactions",
          topics: [
            "Types of chemical reactions",
            "Balancing equations",
            "Acids and bases",
            "Redox reactions",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-biology",
      subject: { id: "biology", name: "Biology" },
      title: "Biology",
      units: [
        {
          title: "Cell Biology and Genetics",
          topics: [
            "Cell structure and function",
            "Cell division and reproduction",
            "Genetics and heredity",
            "DNA and protein synthesis",
          ],
        },
        {
          title: "Ecology and Evolution",
          topics: [
            "Ecosystems and food webs",
            "Environmental interactions",
            "Evolution and adaptation",
            "Biodiversity and conservation",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-history",
      subject: { id: "history", name: "History" },
      title: "History",
      units: [
        {
          title: "Caribbean History",
          topics: [
            "Pre-Columbian Caribbean",
            "European colonization",
            "Slavery and emancipation",
            "Independence movements",
          ],
        },
        {
          title: "World History",
          topics: [
            "Major world events",
            "Political and social movements",
            "Economic developments",
            "Cultural exchanges",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-geography",
      subject: { id: "geography", name: "Geography" },
      title: "Geography",
      units: [
        {
          title: "Physical Geography",
          topics: [
            "Landforms and processes",
            "Climate and weather",
            "Natural resources",
            "Environmental issues",
          ],
        },
        {
          title: "Human Geography",
          topics: [
            "Population and migration",
            "Urban and rural development",
            "Economic activities",
            "Cultural geography",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-spanish",
      subject: { id: "spanish", name: "Spanish" },
      title: "Intermediate Spanish",
      units: [
        {
          title: "Language Development",
          topics: [
            "Expanded vocabulary",
            "Complex grammar structures",
            "Conversation skills",
            "Cultural studies",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-art",
      subject: { id: "art", name: "Visual Arts" },
      title: "Advanced Visual Arts",
      units: [
        {
          title: "Art History and Theory",
          topics: [
            "Art movements and styles",
            "Famous artists and works",
            "Art criticism and analysis",
            "Contemporary art trends",
          ],
        },
        {
          title: "Advanced Techniques",
          topics: [
            "Advanced drawing methods",
            "Mixed media techniques",
            "Digital art and design",
            "Portfolio development",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-physical-education",
      subject: { id: "pe", name: "Physical Education" },
      title: "Physical Education",
      units: [
        {
          title: "Advanced Fitness and Sports",
          topics: [
            "Advanced fitness training",
            "Competitive sports",
            "Health and nutrition",
            "Sports psychology",
          ],
        },
      ],
    },
    {
      id: "magy-grade8-computer-studies",
      subject: { id: "computer-studies", name: "Computer Studies" },
      title: "Advanced Computer Studies",
      units: [
        {
          title: "Programming and Software",
          topics: [
            "Introduction to programming",
            "Database management",
            "Web design basics",
            "Computer networks",
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
          quantity: 25,
          unit: "books",
        },
        {
          item: findItemById("supply-double-line-book")!,
          quantity: 3,
          unit: "books",
        },
        {
          item: findItemById("supply-drawing-book")!,
          quantity: 2,
          unit: "books",
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
          quantity: 3,
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
        {
          item: findItemById("supply-protractor")!,
          quantity: 1,
          unit: "protractor",
        },
        {
          item: findItemById("supply-compass")!,
          quantity: 1,
          unit: "compass",
        },
      ],
    },
  ],
};
