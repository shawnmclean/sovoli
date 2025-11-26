import { SECONDARY_PHOTOS, shuffleArray } from "../../photos";
import type { Program } from "~/modules/academics/types";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  secondaryProgramHighlights,
  MAGY_SECONDARY_DEPT_ACTIVITIES,
  magyProgramQuickFacts,
} from "./shared";

export const MAGY_SECONDARY_GRADE_10_PROGRAM: Program = {
  id: "magy-secondary-grade-10",
  slug: "grade-10",
  audience: "parent",
  name: "Grade 10",
  admission: {
    id: "magy-secondary-grade-10-admission",
    documents: [],
    eligibility: [
      {
        type: "age",
        ageRange: { minAgeYears: 15, maxAgeYears: 16 },
      },
    ],
  },
  highlights: secondaryProgramHighlights,
  quickFacts: magyProgramQuickFacts,
  tagline: "CSEC examination year",
  outcome: "CSEC (Caribbean Secondary Education Certificate)",
  description:
    "Final year of secondary education with intensive CSEC examination preparation and completion",
  media: shuffleArray(SECONDARY_PHOTOS),
  cycles: [], // Will be added when cycles are created
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_SECONDARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade10-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "CSEC Mathematics",
      units: [
        {
          title: "CSEC Mathematics Core Topics",
          topics: [
            "Number theory and operations",
            "Algebra and functions",
            "Geometry and measurement",
            "Statistics and probability",
          ],
        },
        {
          title: "CSEC Examination Preparation",
          topics: [
            "Past paper analysis",
            "Examination techniques",
            "Problem-solving strategies",
            "Time management skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-english",
      subject: { id: "english", name: "English Language" },
      title: "CSEC English Language",
      units: [
        {
          title: "CSEC English Language Skills",
          topics: [
            "Reading comprehension strategies",
            "Summary writing techniques",
            "Essay writing formats",
            "Grammar and usage",
          ],
        },
        {
          title: "CSEC Literature Analysis",
          topics: [
            "Poetry analysis and interpretation",
            "Prose and drama study",
            "Literary devices and techniques",
            "Critical thinking and analysis",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-physics",
      subject: { id: "physics", name: "Physics" },
      title: "CSEC Physics",
      units: [
        {
          title: "CSEC Physics Core Concepts",
          topics: [
            "Mechanics and motion",
            "Waves and vibrations",
            "Electricity and magnetism",
            "Light and optics",
          ],
        },
        {
          title: "Practical Physics and Laboratory Work",
          topics: [
            "Experimental design",
            "Data collection and analysis",
            "Laboratory safety",
            "Scientific method application",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-chemistry",
      subject: { id: "chemistry", name: "Chemistry" },
      title: "CSEC Chemistry",
      units: [
        {
          title: "CSEC Chemistry Core Topics",
          topics: [
            "Atomic structure and bonding",
            "Chemical reactions and equations",
            "Acids, bases, and salts",
            "Organic chemistry basics",
          ],
        },
        {
          title: "Practical Chemistry and Laboratory Work",
          topics: [
            "Laboratory techniques",
            "Chemical analysis methods",
            "Safety procedures",
            "Data interpretation",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-biology",
      subject: { id: "biology", name: "Biology" },
      title: "CSEC Biology",
      units: [
        {
          title: "CSEC Biology Core Topics",
          topics: [
            "Cell biology and genetics",
            "Human biology and health",
            "Ecology and environment",
            "Plant and animal biology",
          ],
        },
        {
          title: "Practical Biology and Field Work",
          topics: [
            "Microscopy techniques",
            "Field studies and data collection",
            "Laboratory investigations",
            "Scientific reporting",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-history",
      subject: { id: "history", name: "History" },
      title: "CSEC History",
      units: [
        {
          title: "CSEC History Core Content",
          topics: [
            "Caribbean history (1492-1838)",
            "Caribbean history (1838-2000)",
            "Historical skills and methods",
            "Source analysis and interpretation",
          ],
        },
        {
          title: "Historical Research and Analysis",
          topics: [
            "Primary and secondary sources",
            "Historical argumentation",
            "Essay writing techniques",
            "Examination preparation",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-geography",
      subject: { id: "geography", name: "Geography" },
      title: "CSEC Geography",
      units: [
        {
          title: "CSEC Geography Core Topics",
          topics: [
            "Physical geography systems",
            "Human geography patterns",
            "Environmental issues",
            "Geographic skills and techniques",
          ],
        },
        {
          title: "Geographic Investigation and Field Work",
          topics: [
            "Data collection methods",
            "Map reading and interpretation",
            "Statistical analysis",
            "Report writing",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-spanish",
      subject: { id: "spanish", name: "Spanish" },
      title: "CSEC Spanish",
      units: [
        {
          title: "CSEC Spanish Language Skills",
          topics: [
            "Reading comprehension",
            "Writing composition",
            "Listening comprehension",
            "Speaking and conversation",
          ],
        },
        {
          title: "Cultural Studies and Literature",
          topics: [
            "Hispanic culture and traditions",
            "Spanish literature",
            "Cultural comparisons",
            "Contemporary issues",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-art",
      subject: { id: "art", name: "Visual Arts" },
      title: "CSEC Visual Arts",
      units: [
        {
          title: "CSEC Visual Arts Portfolio",
          topics: [
            "Portfolio development",
            "Artistic techniques and media",
            "Art history and criticism",
            "Cultural and contemporary art",
          ],
        },
        {
          title: "Exhibition and Presentation",
          topics: [
            "Art exhibition preparation",
            "Artist statement writing",
            "Critique and analysis",
            "Professional presentation",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-physical-education",
      subject: { id: "pe", name: "Physical Education" },
      title: "Physical Education",
      units: [
        {
          title: "Health and Fitness Education",
          topics: [
            "Personal fitness planning",
            "Health and wellness concepts",
            "Sports science principles",
            "Lifestyle and nutrition",
          ],
        },
      ],
    },
    {
      id: "magy-grade10-computer-studies",
      subject: { id: "computer-studies", name: "Computer Studies" },
      title: "CSEC Computer Studies",
      units: [
        {
          title: "CSEC Computer Studies Core",
          topics: [
            "Computer hardware and software",
            "Programming and algorithms",
            "Database management",
            "Computer networks and security",
          ],
        },
        {
          title: "Practical Computer Applications",
          topics: [
            "Software development projects",
            "Database design and implementation",
            "Web development",
            "System analysis and design",
          ],
        },
      ],
    },
  ],
};
