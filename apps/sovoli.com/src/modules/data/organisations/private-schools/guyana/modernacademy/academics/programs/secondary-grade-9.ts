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

export const MAGY_SECONDARY_GRADE_9_PROGRAM: Program = {
  id: "magy-secondary-grade-9",
  slug: "grade-9",
  audience: "parent",
  name: "Grade 9",
  admission: {
    id: "magy-secondary-grade-9-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 14, maxAgeYears: 15 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "CSEC preparation begins",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description:
    "Advanced secondary education with focused CSEC examination preparation",
  photos: shuffleArray(SECONDARY_PHOTOS),
  cycles: [], // Will be added when cycles are created
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade9-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "CSEC Mathematics Preparation",
      units: [
        {
          title: "Advanced Algebra and Functions",
          topics: [
            "Quadratic and cubic functions",
            "Polynomial operations",
            "Rational expressions",
            "Exponential and logarithmic functions",
          ],
        },
        {
          title: "Geometry and Trigonometry",
          topics: [
            "Advanced geometric proofs",
            "Trigonometric identities",
            "Sine and cosine rules",
            "Coordinate geometry",
          ],
        },
        {
          title: "Statistics and Probability",
          topics: [
            "Descriptive statistics",
            "Probability distributions",
            "Hypothesis testing",
            "Data analysis and interpretation",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-english",
      subject: { id: "english", name: "English Language" },
      title: "CSEC English Language and Literature",
      units: [
        {
          title: "Literature Analysis and Criticism",
          topics: [
            "Caribbean literature study",
            "Poetry analysis and interpretation",
            "Drama and prose analysis",
            "Literary criticism techniques",
          ],
        },
        {
          title: "Advanced Writing and Communication",
          topics: [
            "Expository and argumentative writing",
            "Research methodology",
            "Critical analysis essays",
            "Oral presentation skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-physics",
      subject: { id: "physics", name: "Physics" },
      title: "CSEC Physics",
      units: [
        {
          title: "Mechanics and Motion",
          topics: [
            "Kinematics and dynamics",
            "Work, energy, and power",
            "Momentum and collisions",
            "Circular motion and gravitation",
          ],
        },
        {
          title: "Waves, Light, and Sound",
          topics: [
            "Wave properties and behavior",
            "Light and optics",
            "Sound waves and acoustics",
            "Electromagnetic spectrum",
          ],
        },
        {
          title: "Electricity and Magnetism",
          topics: [
            "Electric fields and potential",
            "Current and resistance",
            "Magnetic fields and forces",
            "Electromagnetic induction",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-chemistry",
      subject: { id: "chemistry", name: "Chemistry" },
      title: "CSEC Chemistry",
      units: [
        {
          title: "Atomic Structure and Bonding",
          topics: [
            "Atomic theory and quantum mechanics",
            "Chemical bonding theories",
            "Molecular geometry",
            "Intermolecular forces",
          ],
        },
        {
          title: "Chemical Reactions and Stoichiometry",
          topics: [
            "Balancing chemical equations",
            "Stoichiometric calculations",
            "Acid-base chemistry",
            "Redox reactions and electrochemistry",
          ],
        },
        {
          title: "Organic Chemistry",
          topics: [
            "Hydrocarbon chemistry",
            "Functional groups",
            "Organic reactions",
            "Polymers and biomolecules",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-biology",
      subject: { id: "biology", name: "Biology" },
      title: "CSEC Biology",
      units: [
        {
          title: "Cell Biology and Biochemistry",
          topics: [
            "Cell structure and organelles",
            "Cellular processes and metabolism",
            "Enzymes and biochemical pathways",
            "DNA structure and replication",
          ],
        },
        {
          title: "Genetics and Evolution",
          topics: [
            "Mendelian genetics",
            "Molecular genetics",
            "Evolution and natural selection",
            "Population genetics",
          ],
        },
        {
          title: "Ecology and Environmental Biology",
          topics: [
            "Ecosystem dynamics",
            "Biodiversity and conservation",
            "Environmental pollution",
            "Sustainable development",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-history",
      subject: { id: "history", name: "History" },
      title: "CSEC History",
      units: [
        {
          title: "Caribbean History (1492-1838)",
          topics: [
            "Indigenous peoples and early encounters",
            "European colonization and settlement",
            "Slavery and plantation society",
            "Resistance and emancipation",
          ],
        },
        {
          title: "Caribbean History (1838-2000)",
          topics: [
            "Post-emancipation society",
            "Indentureship and immigration",
            "Nationalism and independence",
            "Modern Caribbean development",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-geography",
      subject: { id: "geography", name: "Geography" },
      title: "CSEC Geography",
      units: [
        {
          title: "Physical Geography",
          topics: [
            "Geological processes and landforms",
            "Weather and climate systems",
            "Natural hazards and disasters",
            "Environmental management",
          ],
        },
        {
          title: "Human Geography",
          topics: [
            "Population dynamics and migration",
            "Urban and rural development",
            "Economic activities and trade",
            "Sustainable development",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-spanish",
      subject: { id: "spanish", name: "Spanish" },
      title: "CSEC Spanish",
      units: [
        {
          title: "Advanced Language Skills",
          topics: [
            "Complex grammar structures",
            "Advanced vocabulary",
            "Conversation and debate",
            "Cultural studies and literature",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-art",
      subject: { id: "art", name: "Visual Arts" },
      title: "CSEC Visual Arts",
      units: [
        {
          title: "Art History and Criticism",
          topics: [
            "Major art movements",
            "Caribbean art traditions",
            "Art criticism and analysis",
            "Contemporary art practices",
          ],
        },
        {
          title: "Advanced Studio Practice",
          topics: [
            "Portfolio development",
            "Mixed media techniques",
            "Digital art and design",
            "Exhibition preparation",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-physical-education",
      subject: { id: "pe", name: "Physical Education" },
      title: "Physical Education",
      units: [
        {
          title: "Advanced Fitness and Sports Science",
          topics: [
            "Exercise physiology",
            "Sports psychology",
            "Training methodologies",
            "Health and wellness",
          ],
        },
      ],
    },
    {
      id: "magy-grade9-computer-studies",
      subject: { id: "computer-studies", name: "Computer Studies" },
      title: "CSEC Computer Studies",
      units: [
        {
          title: "Programming and Software Development",
          topics: [
            "Programming languages and concepts",
            "Database design and management",
            "Web development",
            "Computer networks and security",
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
          quantity: 30,
          unit: "books",
        },
        {
          item: findItemById("supply-double-line-book")!,
          quantity: 4,
          unit: "books",
        },
        {
          item: findItemById("supply-drawing-book")!,
          quantity: 3,
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
          quantity: 4,
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
        {
          item: findItemById("supply-ruler")!,
          quantity: 2,
          unit: "rulers",
          notes: "30cm ruler",
        },
      ],
    },
  ],
};
