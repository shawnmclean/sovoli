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
          type: "book",
          title: "Coloring Book (Letters & Numbers)",
          kind: "exercise",
        },
      ],
    },
    {
      name: "Supplies",
      category: "materials",
      audience: "parent",
      items: [
        {
          type: "supply",
          name: "Crayola Crayons (Fat)",
          category: "stationery",
        },
        { type: "supply", name: "Crayola Play Dough", category: "craft" },
        { type: "supply", name: "Art Book", category: "stationery" },
        { type: "supply", name: "Building Blocks", category: "learning-aid" },
        { type: "supply", name: "Paint Set", category: "craft" },
        {
          type: "supply",
          name: "Card Board Sheet",
          quantity: 2,
          unit: "sheet",
          category: "craft",
        },
        { type: "supply", name: "Glue", category: "craft" },
        { type: "supply", name: "Detergent", category: "general" },
        {
          type: "supply",
          name: "Hand Sanitizer",
          unit: "bottle",
          category: "general",
        },
        {
          type: "supply",
          name: "Paper Towel",
          quantity: 1,
          unit: "roll",
          category: "general",
        },
        {
          type: "supply",
          name: "Liquid Soap",
          unit: "bottle",
          category: "general",
        },
        {
          type: "supply",
          name: "Toilet Paper",
          quantity: 1,
          unit: "roll",
          category: "general",
        },
      ],
    },
  ],
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
  requirements: [
    {
      name: "Books",
      category: "booklist",
      audience: "parent",
      items: [
        {
          type: "book",
          title: "Animal Friends Level A Reader",
          series: "Animal Friends",
          level: "Level A",
          kind: "reader",
        },
        {
          type: "book",
          title: "Animal Friends Level A Workbook",
          series: "Animal Friends",
          level: "Level A",
          kind: "workbook",
        },
        { type: "book", title: "Big and Easy Coloring Book", kind: "exercise" },
        {
          type: "book",
          title: "Roraima Readers Nursery Year 1 Literacy",
          series: "Roraima Readers",
          kind: "textbook",
        },
        {
          type: "book",
          title: "Roraima Readers Nursery Year 1 Numeracy",
          series: "Roraima Readers",
          kind: "textbook",
        },
        {
          type: "book",
          title: "Roraima Reader Workbook 1 (Writing Skills)",
          series: "Roraima Readers",
          kind: "workbook",
        },
      ],
    },
    {
      name: "Supplies",
      category: "materials",
      audience: "parent",
      items: [
        { type: "supply", name: "Fat Pencil", category: "stationery" },
        {
          type: "supply",
          name: "Single Line Book",
          quantity: 2,
          category: "stationery",
        },
        {
          type: "supply",
          name: "Art Book",
          quantity: 1,
          category: "stationery",
        },
        { type: "supply", name: "Pack of Letters", category: "learning-aid" },
        { type: "supply", name: "Pack of Numbers", category: "learning-aid" },
        {
          type: "supply",
          name: "Sheet Card Boards",
          quantity: 2,
          unit: "sheet",
          category: "craft",
        },
        {
          type: "supply",
          name: "Pack Blocks",
          quantity: 1,
          unit: "pack",
          category: "learning-aid",
        },
        {
          type: "supply",
          name: "Paint Set",
          notes: "Crayola",
          quantity: 1,
          unit: "set",
          category: "craft",
        },
        {
          type: "hygiene",
          name: "Hand Sanitizer",
          quantity: 1,
          unit: "bottle",
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
        { type: "book", title: "Animal Readers", kind: "reader" },
        {
          type: "book",
          title: "Roraima Reader Numeracy Workbook (Book 2)",
          series: "Roraima Readers",
          level: "Book 2",
          kind: "workbook",
        },
        {
          type: "book",
          title: "Roraima Reader Literacy Nursery Year 2",
          series: "Roraima Readers",
          level: "Nursery Year 2",
          kind: "textbook",
        },
        { type: "book", title: "Coloring Book", kind: "exercise" }, // treated as an exercise book
      ],
    },
    {
      name: "Supplies",
      category: "materials",
      audience: "parent",
      items: [
        { type: "supply", name: "Crayola Crayons", category: "stationery" },
        {
          type: "supply",
          name: "Art Book",
          quantity: 1,
          category: "stationery",
        }, // drawing pad / sketch book
        {
          type: "supply",
          name: "Fine Line Book",
          quantity: 1,
          category: "stationery",
        }, // copybook with fine ruling
        {
          type: "supply",
          name: "4 Line Book",
          quantity: 1,
          category: "stationery",
        }, // early-writing copybook
        {
          type: "supply",
          name: "Pencils",
          quantity: 2,
          unit: "each",
          category: "stationery",
        },
        {
          type: "supply",
          name: "Sheet Card Board",
          quantity: 2,
          unit: "sheet",
          category: "craft",
        },
        {
          type: "supply",
          name: "Pack Blocks",
          quantity: 1,
          unit: "pack",
          category: "learning-aid",
        },
        {
          type: "supply",
          name: "Paint Set",
          notes: "Crayola",
          quantity: 1,
          unit: "set",
          category: "craft",
        },
        { type: "supply", name: "Soap", quantity: 1, category: "general" }, // unit unspecified on sheet
        { type: "supply", name: "Detergent", quantity: 1, category: "general" }, // unit unspecified on sheet
        {
          type: "supply",
          name: "Hand Sanitizer",
          quantity: 1,
          unit: "bottle",
          category: "general",
        },
        {
          type: "supply",
          name: "Bounty Tissue",
          quantity: 1,
          unit: "roll",
          category: "general",
          notes: "brand: Bounty",
        },
        {
          type: "supply",
          name: "Toilet Paper",
          quantity: 1,
          unit: "roll",
          category: "general",
        },
      ],
    },
  ],
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
