import { SECONDARY_PHOTOS, shuffleArray } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import { hydrateProgramCategory } from "~/modules/data/academics/categories";
import {
  secondaryProgramHighlights,
  MAGY_SECONDARY_DEPT_ACTIVITIES,
  magyProgramQuickFacts,
} from "./shared";

export const MAGY_SECONDARY_GRADE_11_PROGRAM: Program = {
  id: "magy-secondary-grade-11",
  slug: "grade-11",
  audience: "parent",
  name: "Grade 11",
  category: hydrateProgramCategory("grade-11"),
  admission: {
    id: "magy-secondary-grade-11-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 16, maxAgeYears: 17 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "Advanced CSEC preparation and CAPE foundation",
  outcome:
    "CSEC (Caribbean Secondary Education Certificate) + CAPE Preparation",
  description:
    "Advanced secondary education with intensive CSEC completion and CAPE preparation for university readiness",
  media: { gallery: shuffleArray(SECONDARY_PHOTOS) },
  cycles: [], // Will be added when cycles are created
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade11-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Advanced Mathematics and CAPE Preparation",
      units: [
        {
          title: "Advanced CSEC Mathematics",
          topics: [
            "Complex number theory",
            "Advanced calculus concepts",
            "Mathematical modeling",
            "Statistical analysis and probability",
          ],
        },
        {
          title: "CAPE Mathematics Foundation",
          topics: [
            "Pure mathematics concepts",
            "Applied mathematics",
            "Mathematical reasoning",
            "Problem-solving strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-english",
      subject: { id: "english", name: "English Language" },
      title: "Advanced English and CAPE Literature",
      units: [
        {
          title: "Advanced English Language Skills",
          topics: [
            "Advanced writing techniques",
            "Critical analysis and evaluation",
            "Research methodology",
            "Academic writing standards",
          ],
        },
        {
          title: "CAPE Literature Preparation",
          topics: [
            "World literature study",
            "Literary theory and criticism",
            "Comparative literature analysis",
            "Advanced essay writing",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-physics",
      subject: { id: "physics", name: "Physics" },
      title: "Advanced Physics and CAPE Preparation",
      units: [
        {
          title: "Advanced Physics Concepts",
          topics: [
            "Quantum mechanics basics",
            "Thermodynamics and heat",
            "Modern physics",
            "Advanced laboratory techniques",
          ],
        },
        {
          title: "CAPE Physics Foundation",
          topics: [
            "Mechanics and dynamics",
            "Waves and oscillations",
            "Electricity and magnetism",
            "Physics problem-solving",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-chemistry",
      subject: { id: "chemistry", name: "Chemistry" },
      title: "Advanced Chemistry and CAPE Preparation",
      units: [
        {
          title: "Advanced Chemistry Concepts",
          topics: [
            "Physical chemistry",
            "Inorganic chemistry",
            "Organic chemistry",
            "Analytical chemistry",
          ],
        },
        {
          title: "CAPE Chemistry Foundation",
          topics: [
            "Atomic structure and bonding",
            "Chemical kinetics and equilibrium",
            "Acid-base chemistry",
            "Laboratory techniques",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-biology",
      subject: { id: "biology", name: "Biology" },
      title: "Advanced Biology and CAPE Preparation",
      units: [
        {
          title: "Advanced Biology Concepts",
          topics: [
            "Molecular biology",
            "Genetics and biotechnology",
            "Ecology and conservation",
            "Human physiology",
          ],
        },
        {
          title: "CAPE Biology Foundation",
          topics: [
            "Cell biology and biochemistry",
            "Genetics and evolution",
            "Ecology and environment",
            "Research methodology",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-history",
      subject: { id: "history", name: "History" },
      title: "Advanced History and CAPE Preparation",
      units: [
        {
          title: "Advanced Historical Analysis",
          topics: [
            "Historical methodology",
            "Comparative history",
            "Historiography",
            "Research and documentation",
          ],
        },
        {
          title: "CAPE History Foundation",
          topics: [
            "Caribbean history themes",
            "World history perspectives",
            "Historical skills development",
            "Critical analysis techniques",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-geography",
      subject: { id: "geography", name: "Geography" },
      title: "Advanced Geography and CAPE Preparation",
      units: [
        {
          title: "Advanced Geographic Concepts",
          topics: [
            "Geographic information systems",
            "Environmental management",
            "Urban and regional planning",
            "Climate change studies",
          ],
        },
        {
          title: "CAPE Geography Foundation",
          topics: [
            "Physical geography systems",
            "Human geography patterns",
            "Geographic skills",
            "Field work and research",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-spanish",
      subject: { id: "spanish", name: "Spanish" },
      title: "Advanced Spanish and CAPE Preparation",
      units: [
        {
          title: "Advanced Spanish Language",
          topics: [
            "Advanced grammar and syntax",
            "Literary analysis in Spanish",
            "Cultural studies",
            "Translation techniques",
          ],
        },
        {
          title: "CAPE Spanish Foundation",
          topics: [
            "Language skills development",
            "Literature study",
            "Cultural awareness",
            "Communication skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-art",
      subject: { id: "art", name: "Visual Arts" },
      title: "Advanced Visual Arts and CAPE Preparation",
      units: [
        {
          title: "Advanced Studio Practice",
          topics: [
            "Portfolio development",
            "Advanced techniques",
            "Digital art and design",
            "Exhibition preparation",
          ],
        },
        {
          title: "CAPE Visual Arts Foundation",
          topics: [
            "Art history and theory",
            "Cultural and contemporary art",
            "Critical analysis",
            "Professional practice",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-physical-education",
      subject: { id: "pe", name: "Physical Education" },
      title: "Advanced Physical Education",
      units: [
        {
          title: "Sports Science and Health",
          topics: [
            "Exercise physiology",
            "Sports psychology",
            "Nutrition and wellness",
            "Fitness assessment",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-computer-studies",
      subject: { id: "computer-studies", name: "Computer Studies" },
      title: "Advanced Computer Studies and CAPE Preparation",
      units: [
        {
          title: "Advanced Programming and Development",
          topics: [
            "Object-oriented programming",
            "Database design and management",
            "Web development",
            "Software engineering principles",
          ],
        },
        {
          title: "CAPE Computer Science Foundation",
          topics: [
            "Computer science fundamentals",
            "Algorithms and data structures",
            "Computer systems",
            "Problem-solving techniques",
          ],
        },
      ],
    },
    {
      id: "magy-grade11-economics",
      subject: { id: "economics", name: "Economics" },
      title: "Economics and CAPE Preparation",
      units: [
        {
          title: "Microeconomics and Macroeconomics",
          topics: [
            "Supply and demand analysis",
            "Market structures",
            "National income accounting",
            "Economic policy analysis",
          ],
        },
        {
          title: "CAPE Economics Foundation",
          topics: [
            "Economic principles",
            "Market analysis",
            "Economic development",
            "International economics",
          ],
        },
      ],
    },
  ],
};
