import type {
  ProgramAssessment,
  ProgramAssessmentVersion,
  ProgramLevel,
  StandardProgram,
  StandardProgramVersion,
  Course,
} from "~/modules/academics/types";

// #region nursery

export const GY_NURSERY_LEVELS: ProgramLevel[] = [
  {
    id: "gy-nursery-level-1",
    programId: "gy-nursery",
    order: 0,
    label: "Year 1",
    type: "year",
    ageRange: { min: 2, max: 3 },
  },
  {
    id: "gy-nursery-level-2",
    programId: "gy-nursery",
    order: 1,
    label: "Year 2",
    type: "year",
    ageRange: { min: 3, max: 4 },
  },
];

export const GY_NURSERY_PROGRAM: StandardProgram = {
  id: "gy-nursery",
  name: "Nursery",
  description:
    "Early childhood education program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/nursery.webp",
};

export const GY_NURSERY_V1: StandardProgramVersion = {
  id: "gy-nursery-v1",
  program: GY_NURSERY_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  requirements: [
    {
      type: "age",
      description: "Child must be 3–5 years old by September 1st",
      ageRange: { minAgeYears: 3, maxAgeYears: 5 },
    },
    {
      type: "document",
      name: "Birth Certificate",
    },
  ],
  levels: GY_NURSERY_LEVELS,
};
// #endregion

// #region primary

export const GY_PRIMARY_GRADE_1_COURSES: Course[] = [
  {
    id: "gy-primary-grade-1-course-1",
    subject: { id: "gy-primary-subject-1", name: "English" },
    title: "English",
  },
];

export const GY_PRIMARY_LEVELS: ProgramLevel[] = [
  {
    id: "gy-primary-level-1",

    order: 0,
    label: "Grade 1",
    type: "grade",
    ageRange: { min: 5, max: 6 },
    courses: GY_PRIMARY_GRADE_1_COURSES,
  },
  {
    id: "gy-primary-level-2",
    order: 1,
    label: "Grade 2",
    type: "grade",
    ageRange: { min: 6, max: 7 },
  },
  {
    id: "gy-primary-level-3",
    order: 2,
    label: "Grade 3",
    type: "grade",
    ageRange: { min: 7, max: 8 },
  },
  {
    id: "gy-primary-level-4",
    order: 3,
    label: "Grade 4",
    type: "grade",
    ageRange: { min: 8, max: 9 },
  },
  {
    id: "gy-primary-level-5",
    order: 4,
    label: "Grade 5",
    type: "grade",
    ageRange: { min: 9, max: 10 },
  },
  {
    id: "gy-primary-level-6",
    order: 5,
    label: "Grade 6",
    type: "grade",
    ageRange: { min: 10, max: 11 },
  },
];

export const GY_PRIMARY_ASSESSMENT_NGSA: ProgramAssessment = {
  id: "ngsa",
  name: "National Grade Six Assessment",
  shortName: "NGSA",
  description: "National assessment for grade six students",
};

export const GY_PRIMARY_ASSESSMENT_NGSA_V1: ProgramAssessmentVersion = {
  id: "ngsa-v1",
  assessment: GY_PRIMARY_ASSESSMENT_NGSA,
  version: 1,
  effectiveFrom: "2023-01-01",
};

export const GY_PRIMARY_PROGRAM: StandardProgram = {
  id: "gy-primary",
  name: "Primary",
  description:
    "Primary education program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/primary.webp",
};
export const GY_PRIMARY_V1: StandardProgramVersion = {
  id: "gy-primary-v1",
  program: GY_PRIMARY_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  requirements: [
    {
      type: "age",
      description: "Child must be 5–11 years old by September 1st",
      ageRange: { minAgeYears: 5, maxAgeYears: 11 },
    },
  ],
  assessments: [GY_PRIMARY_ASSESSMENT_NGSA_V1],
  levels: GY_PRIMARY_LEVELS,
};

// #endregion

// #region secondary

export const GY_SECONDARY_PROGRAM: StandardProgram = {
  id: "gy-secondary",
  name: "Secondary",
  description:
    "Secondary education program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/secondary.webp",
};

export const GY_SECONDARY_V1: StandardProgramVersion = {
  id: "gy-secondary-v1",
  program: GY_SECONDARY_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
};

// #endregion
