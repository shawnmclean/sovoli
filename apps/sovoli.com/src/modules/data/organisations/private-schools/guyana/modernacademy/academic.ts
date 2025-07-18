import type {
  AcademicModule,
  Activity,
  OrgAcademicCycle,
  OrgProgram,
  OrgProgramCycle,
  ProgramLevel,
} from "~/modules/academics/types";
import type { Discount, PricingItem } from "~/modules/core/economics/types";
import { GY_CYCLE_2025_T1 } from "~/modules/data/academics/guyana/cycles";
import {
  GY_NURSERY_V1,
  GY_PRIMARY_V1,
  GY_SECONDARY_V1,
  GY_NURSERY_LEVELS,
  GY_PRIMARY_LEVELS,
} from "~/modules/data/academics/guyana/programs";
import {
  NURSERY_PHOTOS,
  PRE_NURSERY_PHOTOS,
  PRIMARY_PHOTOS,
  SECONDARY_PHOTOS,
} from "./photos";
import {
  JESSICA_GOBIN,
  SIR_CHABEERAJ_FRANCIS,
  WONDA_BARON,
  MOLTA_MCRAE,
  SAMANTHA_PERSAUD,
  ANITA_DHANIRAM,
} from "./workforce";

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

const MAGY_PRE_NURSERY_LEVEL: ProgramLevel = {
  id: "magy-pre-nursery",
  order: 0,
  label: "Pre-Nursery",
  type: "year",
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
};

// #region programs

export const MAGY_PRE_NURSERY_PROGRAM: OrgProgram = {
  slug: "pre-nursery",
  name: "Pre-Nursery (Playschool)",
  tagline: "Play, explore, and grow together",
  outcome: "School Readiness",
  description: "Strong foundational learning in a nurturing environment",
  image: "/orgs/private-schools/guyana/modernacademy/programs/pre-nursery.webp",
  photos: PRE_NURSERY_PHOTOS,
  requirements: [
    {
      type: "age",
      ageRange: {
        minAgeYears: 2,
        maxAgeYears: 3,
      },
    },
  ],
  levels: [MAGY_PRE_NURSERY_LEVEL],
  isPopular: true,
};
export const MAGY_NURSERY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_NURSERY_V1,
  slug: "nursery",
  tagline: "Skills that prepare for primary school",
  outcome: "Early Literacy & Numeracy",
  description: "Engaging curriculum fostering critical thinking and creativity",
  image: "/orgs/private-schools/guyana/modernacademy/programs/nursery.webp",
  photos: NURSERY_PHOTOS,
  isPopular: true,
};

export const MAGY_PRIMARY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_PRIMARY_V1,
  slug: "primary",
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  image: "/orgs/private-schools/guyana/modernacademy/programs/primary.webp",
  photos: PRIMARY_PHOTOS,
};

export const MAGY_SECONDARY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_SECONDARY_V1,
  slug: "secondary",
  tagline: "Guided by med scholars. Built for results.",
  outcome: "CXC, GCE O-Level ",
  description: "Engaging curriculum fostering critical thinking and creativity",
  image: "/orgs/private-schools/guyana/modernacademy/programs/secondary.webp",
  photos: SECONDARY_PHOTOS,
};

// #endregion

// #region academic cycles

export const MAGY_ACADEMIC_CYCLE_2025_T1: OrgAcademicCycle = {
  id: "magy-2025-t1",
  globalCycle: GY_CYCLE_2025_T1,
};

// #endregion

// #region program cycles
const registrationFee: PricingItem = {
  id: "registration",
  label: "Registration",
  billingCycle: "one-time",
  purpose: "registration",
  amount: { GYD: 6000 },
};

const registrationDiscount: Discount = {
  id: "early-bird",
  label: "Early Bird",
  message: "Early Bird discount",
  value: 100,
  type: "percentage",
  appliesTo: ["registration"],
  validUntil: "2025-07-18",
};

const registrationPeriod2025T1 = {
  startDate: "2025-07-01",
  endDate: "2025-08-15",
};

export const MAGY_PRE_NURSERY_2025_T1: OrgProgramCycle = {
  id: "magy-pre-nursery-2025-t1",
  orgProgram: MAGY_PRE_NURSERY_PROGRAM,
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  pricingPackage: {
    discounts: [registrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 68000 },
      },
    ],
  },
  registrationPeriod: registrationPeriod2025T1,

  computedRequirements: [
    ...(MAGY_PRE_NURSERY_PROGRAM.requirements ?? []),
    ...(MAGY_PRE_NURSERY_PROGRAM.standardProgramVersion?.requirements ?? []),
  ],
  levelCycles: [
    {
      teachers: [ANITA_DHANIRAM],
      level: MAGY_PRE_NURSERY_LEVEL,
      capacity: 25,
      enrolled: 18,
    },
  ],
};

export const MAGY_NURSERY_2025_T1: OrgProgramCycle = {
  id: "magy-nursery-2025-t1",
  orgProgram: MAGY_NURSERY_PROGRAM,
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  pricingPackage: {
    discounts: [registrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 60000 },
      },
    ],
  },
  registrationPeriod: registrationPeriod2025T1,
  computedRequirements: [
    ...(MAGY_NURSERY_PROGRAM.requirements ?? []),
    ...(MAGY_NURSERY_PROGRAM.standardProgramVersion?.requirements ?? []),
  ],

  levelCycles: [
    {
      teachers: [SAMANTHA_PERSAUD],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      level: GY_NURSERY_LEVELS[0]!,
      capacity: 25,
      enrolled: 15,
    },
    {
      teachers: [JESSICA_GOBIN],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      level: GY_NURSERY_LEVELS[1]!,
      capacity: 25,
      enrolled: 20,
    },
  ],
};

export const MAGY_PRIMARY_2025_T1: OrgProgramCycle = {
  id: "magy-primary-2025-t1",
  orgProgram: MAGY_PRIMARY_PROGRAM,
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [registrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 60000 },
      },
    ],
  },

  computedRequirements: [
    ...(MAGY_PRIMARY_PROGRAM.requirements ?? []),
    ...(MAGY_PRIMARY_PROGRAM.standardProgramVersion?.requirements ?? []),
  ],
  levelCycles: [
    {
      teachers: [WONDA_BARON],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      level: GY_PRIMARY_LEVELS[0]!,
      capacity: 25,
      enrolled: 16,
    },
    {
      teachers: [WONDA_BARON],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      level: GY_PRIMARY_LEVELS[1]!,
      capacity: 25,
      enrolled: 19,
    },
    {
      teachers: [MOLTA_MCRAE],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      level: GY_PRIMARY_LEVELS[2]!,
      capacity: 25,
      enrolled: 22,
    },
    {
      teachers: [MOLTA_MCRAE],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      level: GY_PRIMARY_LEVELS[3]!,
      capacity: 25,
      enrolled: 13,
    },
    {
      teachers: [SIR_CHABEERAJ_FRANCIS],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      level: GY_PRIMARY_LEVELS[4]!,
      capacity: 25,
      enrolled: 17,
    },
    {
      teachers: [SIR_CHABEERAJ_FRANCIS],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      level: GY_PRIMARY_LEVELS[5]!,
      capacity: 25,
      enrolled: 21,
    },
  ],
};

export const MAGY_SECONDARY_2025_T1: OrgProgramCycle = {
  id: "magy-secondary-2025-t1",
  orgProgram: MAGY_SECONDARY_PROGRAM,
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [registrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 60000 },
      },
    ],
  },

  computedRequirements: [
    ...(MAGY_SECONDARY_PROGRAM.requirements ?? []),
    ...(MAGY_SECONDARY_PROGRAM.standardProgramVersion?.requirements ?? []),
  ],
};

// #endregion

export const MODERN_ACADEMY_ACADEMIC: AcademicModule = {
  programs: [
    MAGY_PRE_NURSERY_PROGRAM,
    MAGY_NURSERY_PROGRAM,
    MAGY_PRIMARY_PROGRAM,
    MAGY_SECONDARY_PROGRAM,
  ],
  programCycles: [
    MAGY_PRE_NURSERY_2025_T1,
    MAGY_NURSERY_2025_T1,
    MAGY_PRIMARY_2025_T1,
    MAGY_SECONDARY_2025_T1,
  ],
};
