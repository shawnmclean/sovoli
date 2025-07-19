import {
  GY_NURSERY_YEAR_2_V1,
  GY_PRIMARY_GRADE_1_V1,
  GY_NURSERY_YEAR_1_V1,
} from "~/modules/data/academics/guyana/programs";
import { NURSERY_PHOTOS, PRE_NURSERY_PHOTOS, PRIMARY_PHOTOS } from "../photos";
import type { Activity, Program } from "~/modules/academics/types";
import {
  MAGY_NURSERY_YEAR_1_2025_T1,
  MAGY_NURSERY_YEAR_2_2025_T1,
  MAGY_PRE_NURSERY_2025_T1,
  MAGY_PRIMARY_GRADE_1_2025_T1,
} from "./cycles";

const MAGY_NURSERY_DEPT_ACTIVITIES: Activity[] = [
  {
    id: "mashramani",
    title: "🎭 Mashramani",
  },
  {
    id: "easter-kite-flying",
    title: "🪁 Easter - Kite Flying",
  },
  {
    id: "sports",
    title: "⚽ Sports",
  },
  {
    id: "phagwah",
    title: "🎨 Phagwah",
  },
  {
    id: "diwali",
    title: "🪔 Diwali",
  },
  {
    id: "christmas",
    title: "🎄 Christmas",
  },
  {
    id: "emancipation",
    title: "🕊️ Emancipation",
  },
  {
    id: "singing",
    title: "🎤 Singing",
  },
  {
    id: "dancing",
    title: "💃 Dancing",
  },
  {
    id: "story-telling",
    title: "📚 Story Telling",
  },
  {
    id: "role-play",
    title: "🎭 Role Play",
  },
];

export const MAGY_PRE_NURSERY_PROGRAM: Program = {
  id: "magy-pre-nursery",
  slug: "pre-nursery",
  name: "Pre-Nursery (Playschool)",
  tagline: "Play, explore, and grow together",
  outcome: "School Readiness",
  description: "Strong foundational learning in a nurturing environment",
  ageRange: { min: 2, max: 3 },
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
  photos: PRE_NURSERY_PHOTOS,
  isPopular: true,
  cycles: [MAGY_PRE_NURSERY_2025_T1],
};

// #region programs

export const MAGY_NURSERY_YEAR_1_PROGRAM: Program = {
  id: "magy-nursery-year-1",
  slug: "nursery-year-1",
  tagline: "Skills that prepare for primary school",
  outcome: "Early Literacy & Numeracy",
  description: "Engaging curriculum fostering critical thinking and creativity",
  standardProgramVersion: GY_NURSERY_YEAR_1_V1,

  photos: NURSERY_PHOTOS,
  isPopular: true,
  cycles: [MAGY_NURSERY_YEAR_1_2025_T1],
};

export const MAGY_NURSERY_YEAR_2_PROGRAM: Program = {
  id: "magy-nursery-year-2",
  slug: "nursery-year-2",
  tagline: "Skills that prepare for primary school",
  outcome: "Early Literacy & Numeracy",
  description: "Engaging curriculum fostering critical thinking and creativity",
  standardProgramVersion: GY_NURSERY_YEAR_2_V1,
  photos: NURSERY_PHOTOS,
  isPopular: true,
  cycles: [MAGY_NURSERY_YEAR_2_2025_T1],
};

export const MAGY_PRIMARY_GRADE_1_PROGRAM: Program = {
  id: "magy-primary-grade-1",
  slug: "grade-1",
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_1_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_1_2025_T1],
};

// #endregion
