import {
  GY_NURSERY_YEAR_2_V1,
  GY_PRIMARY_GRADE_1_V1,
  GY_NURSERY_YEAR_1_V1,
} from "~/modules/data/academics/guyana/programs";
import {
  NURSERY_YEAR_1_PHOTOS,
  NURSERY_YEAR_2_PHOTOS,
  PRE_NURSERY_PHOTOS,
  PRIMARY_PHOTOS,
} from "../photos";
import type {
  Activity,
  Program,
  ProgramHighlight,
} from "~/modules/academics/types";
import {
  MAGY_NURSERY_YEAR_1_2025_T1,
  MAGY_NURSERY_YEAR_2_2025_T1,
  MAGY_PRE_NURSERY_2025_T1,
  MAGY_PRIMARY_GRADE_1_2025_T1,
} from "./cycles";
import { MAGY_SHARED_TESTIMONIALS } from "./testimonials";

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
const nurseryProgramHighlights: ProgramHighlight[] = [
  {
    icon: "palette",
    label: "Creative Play",
    description:
      "Children learn through drawing, movement, storytelling, and games.",
  },
  {
    icon: "shield-check",
    label: "Safe & Gated Campus",
    description:
      "Secure entrance, trained staff, and constant supervision ensure your child’s safety.",
  },
  {
    icon: "users",
    label: "Small Class Sizes",
    description:
      "Every child receives individual care, attention, and guided interaction.",
  },
];
export const MAGY_PRE_NURSERY_PROGRAM: Program = {
  id: "magy-pre-nursery",
  slug: "pre-nursery",
  name: "Pre-Nursery (Playschool)",
  audience: "parent",
  highlights: nurseryProgramHighlights,
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
  testimonials: MAGY_SHARED_TESTIMONIALS,
};

// #region programs

export const MAGY_NURSERY_YEAR_1_PROGRAM: Program = {
  id: "magy-nursery-year-1",
  slug: "nursery-year-1",
  audience: "parent",
  highlights: nurseryProgramHighlights,
  tagline: "Skills that prepare for primary school",
  outcome: "Early Literacy & Numeracy",
  description: "Engaging curriculum fostering critical thinking and creativity",
  standardProgramVersion: GY_NURSERY_YEAR_1_V1,

  photos: NURSERY_YEAR_1_PHOTOS,
  isPopular: true,
  cycles: [MAGY_NURSERY_YEAR_1_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_NURSERY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-nursery1-phonics",
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
      id: "magy-nursery1-spelling",
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
      id: "magy-nursery1-reading",
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
      id: "magy-nursery1-socialstudies",
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
      id: "magy-nursery1-science",
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
      id: "magy-nursery1-math",
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
      id: "magy-nursery1-art",
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
      id: "magy-nursery1-writing",
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
      id: "magy-nursery1-storytelling",
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
      id: "magy-nursery1-colouring",
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
      id: "magy-nursery1-craft",
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
};

export const MAGY_NURSERY_YEAR_2_PROGRAM: Program = {
  id: "magy-nursery-year-2",
  slug: "nursery-year-2",
  audience: "parent",
  highlights: nurseryProgramHighlights,
  tagline: "Skills that prepare for primary school",
  outcome: "Early Literacy & Numeracy",
  description: "Engaging curriculum fostering critical thinking and creativity",
  standardProgramVersion: GY_NURSERY_YEAR_2_V1,
  photos: NURSERY_YEAR_2_PHOTOS,
  isPopular: true,
  cycles: [MAGY_NURSERY_YEAR_2_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_NURSERY_DEPT_ACTIVITIES,
};

export const primaryProgramHighlights: ProgramHighlight[] = [
  {
    icon: "graduation-cap",
    label: "NGSA Ready",
    description:
      "Strong foundation in Math, English, Science & Social Studies for high NGSA scores.",
  },
  {
    icon: "book-open",
    label: "Complete Curriculum",
    description:
      "Covers all core subjects with engaging materials and structured assessments.",
  },
  {
    icon: "users",
    label: "Small Class Sizes",
    description:
      "Better focus, participation, and teacher attention per child.",
  },
  {
    icon: "shield-check",
    label: "Safe Environment",
    description:
      "Gated campus, trained staff, and secure classrooms for peace of mind.",
  },
];

export const MAGY_PRIMARY_GRADE_1_PROGRAM: Program = {
  id: "magy-primary-grade-1",
  slug: "grade-1",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_1_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_1_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
};

// #endregion
