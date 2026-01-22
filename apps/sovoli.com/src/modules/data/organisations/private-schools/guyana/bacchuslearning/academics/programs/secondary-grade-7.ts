import type { Program } from "~/modules/academics/types";
import { SECONDARY_PHOTOS } from "../../photos";
import { BLCGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  BLCGY_SECONDARY_DEPT_ACTIVITIES,
  blcgyProgramQuickFacts,
  secondaryProgramHighlights,
} from "./shared";

export const BLCGY_SECONDARY_GRADE_7_PROGRAM: Program = {
  id: "blcgy-secondary-grade-7",
  slug: "grade-7",
  audience: "parent",
  name: "Grade 7",
  admission: {
    id: "blcgy-secondary-grade-7-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 12, maxAgeYears: 13 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: blcgyProgramQuickFacts,
  tagline: "Building foundations for CSEC success",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description:
    "Comprehensive secondary education preparing students for CSEC examinations",
  media: { gallery: SECONDARY_PHOTOS },
  cycles: [], // Will be added when cycles are created
  testimonials: BLCGY_SHARED_TESTIMONIALS,
  activities: BLCGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "blcgy-grade7-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Secondary Mathematics",
      units: [
        {
          title: "Algebra and Number Theory",
          topics: [
            "Algebraic expressions and equations",
            "Linear and quadratic functions",
            "Number systems and operations",
            "Ratio and proportion",
          ],
        },
        {
          title: "Geometry and Measurement",
          topics: [
            "Properties of shapes and angles",
            "Area and perimeter calculations",
            "Coordinate geometry basics",
            "Transformations",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade7-english",
      subject: { id: "english", name: "English Language" },
      title: "English Language and Literature",
      units: [
        {
          title: "Reading and Comprehension",
          topics: [
            "Advanced reading strategies",
            "Literary analysis",
            "Critical thinking skills",
            "Text interpretation",
          ],
        },
        {
          title: "Writing and Communication",
          topics: [
            "Essay writing techniques",
            "Creative writing",
            "Formal and informal writing",
            "Grammar and syntax",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade7-science",
      subject: { id: "science", name: "Integrated Science" },
      title: "Integrated Science",
      units: [
        {
          title: "Physical Sciences",
          topics: [
            "Matter and its properties",
            "Forces and motion",
            "Energy and work",
            "Simple machines",
          ],
        },
        {
          title: "Life Sciences",
          topics: [
            "Cell structure and function",
            "Human body systems",
            "Ecosystems and environment",
            "Classification of living things",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade7-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Social Studies",
      units: [
        {
          title: "History and Geography",
          topics: [
            "Guyana's history and culture",
            "Caribbean history",
            "Physical and human geography",
            "Environmental issues",
          ],
        },
        {
          title: "Civics and Government",
          topics: [
            "Government systems",
            "Citizenship and rights",
            "Economic systems",
            "Social responsibility",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade7-spanish",
      subject: { id: "spanish", name: "Spanish" },
      title: "Spanish Language",
      units: [
        {
          title: "Language Fundamentals",
          topics: [
            "Basic vocabulary and phrases",
            "Grammar structures",
            "Pronunciation and accent",
            "Cultural awareness",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade7-art",
      subject: { id: "art", name: "Visual Arts" },
      title: "Visual Arts",
      units: [
        {
          title: "Art Techniques and Media",
          topics: [
            "Drawing and sketching",
            "Painting techniques",
            "Sculpture and 3D art",
            "Digital art basics",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade7-physical-education",
      subject: { id: "pe", name: "Physical Education" },
      title: "Physical Education",
      units: [
        {
          title: "Fitness and Health",
          topics: [
            "Physical fitness components",
            "Team sports",
            "Individual activities",
            "Health and wellness",
          ],
        },
      ],
    },
    {
      id: "blcgy-grade7-computer-studies",
      subject: { id: "computer-studies", name: "Computer Studies" },
      title: "Computer Studies",
      units: [
        {
          title: "Computer Fundamentals",
          topics: [
            "Computer hardware and software",
            "Word processing",
            "Spreadsheets and databases",
            "Internet and digital literacy",
          ],
        },
      ],
    },
  ],
};
