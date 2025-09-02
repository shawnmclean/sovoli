import type {
  ProgramAssessment,
  ProgramAssessmentVersion,
  StandardProgram,
  StandardProgramVersion,
  Course,
  ProgramGroup,
} from "~/modules/academics/types";

export const GY_PROGRAM_GROUP_NURSERY: ProgramGroup = {
  id: "nursery",
  slug: "nursery",
  name: "Nursery",
  description: "Nursery programs under the Ministry of Education, Guyana",
};

export const GY_PROGRAM_GROUP_PRIMARY: ProgramGroup = {
  id: "primary",
  slug: "primary",
  name: "Primary",
  description: "Primary programs under the Ministry of Education, Guyana",
};

export const GY_PROGRAM_GROUP_SECONDARY: ProgramGroup = {
  id: "secondary",
  slug: "secondary",
  name: "Secondary",
  description: "Secondary programs under the Ministry of Education, Guyana",
};

// #region nursery

export const GY_NURSERY_YEAR_1_PROGRAM: StandardProgram = {
  id: "gy-nursery-year-1",
  name: "Nursery Year 1",
  description:
    "Early childhood education nursery year 1 program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/nursery.webp",
  group: GY_PROGRAM_GROUP_NURSERY,
};

export const GY_NURSERY_YEAR_1_V1: StandardProgramVersion = {
  id: "gy-nursery-year-1-v1",
  program: GY_NURSERY_YEAR_1_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  admission: {
    id: "gy-nursery-year-1-admission",
    eligibility: [
      {
        type: "age",
        description:
          "Child must be 3 years 9 months years old by September 1st",
        ageRange: { minAgeYears: 3, maxAgeYears: 4 },
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
};

export const GY_NURSERY_YEAR_2_PROGRAM: StandardProgram = {
  id: "gy-nursery-year-2",
  name: "Nursery Year 2",
  description:
    "Early childhood education nursery year 2 program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/nursery.webp",
  group: GY_PROGRAM_GROUP_NURSERY,
};

export const GY_NURSERY_YEAR_2_V1: StandardProgramVersion = {
  id: "gy-nursery-year-2-v1",
  program: GY_NURSERY_YEAR_2_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  admission: {
    id: "gy-nursery-year-2-admission",
    eligibility: [
      {
        type: "age",
        description: "Child must be 4 years 9 months old by September 1st",
        ageRange: { minAgeYears: 4, maxAgeYears: 5 },
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
};

// #endregion

// #region primary

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

export const GY_PRIMARY_GRADE_1_COURSES: Course[] = [
  {
    id: "gy-primary-grade-1-course-1",
    subject: { id: "gy-primary-subject-1", name: "English" },
    title: "English",
  },
];

// Individual Grade Programs following nursery pattern
export const GY_PRIMARY_GRADE_1_PROGRAM: StandardProgram = {
  id: "gy-primary-grade-1",
  name: "Grade 1",
  description:
    "Primary education grade 1 program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/primary.webp",
  group: GY_PROGRAM_GROUP_PRIMARY,
};

export const GY_PRIMARY_GRADE_1_V1: StandardProgramVersion = {
  id: "gy-primary-grade-1-v1",
  program: GY_PRIMARY_GRADE_1_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  admission: {
    id: "gy-primary-grade-1-admission",
    eligibility: [
      {
        type: "age",
        description: "Child must be 5–6 years old by September 1st",
        ageRange: { minAgeYears: 5, maxAgeYears: 6 },
      },
    ],
    documents: [],
  },
};

export const GY_PRIMARY_GRADE_2_PROGRAM: StandardProgram = {
  id: "gy-primary-grade-2",
  name: "Grade 2",
  description:
    "Primary education grade 2 program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/primary.webp",
  group: GY_PROGRAM_GROUP_PRIMARY,
};

export const GY_PRIMARY_GRADE_2_V1: StandardProgramVersion = {
  id: "gy-primary-grade-2-v1",
  program: GY_PRIMARY_GRADE_2_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  admission: {
    id: "gy-primary-grade-2-admission",
    eligibility: [
      {
        type: "age",
        description: "Child must be 6–7 years old by September 1st",
        ageRange: { minAgeYears: 6, maxAgeYears: 7 },
      },
    ],
    documents: [],
  },
};

export const GY_PRIMARY_GRADE_3_PROGRAM: StandardProgram = {
  id: "gy-primary-grade-3",
  name: "Grade 3",
  description:
    "Primary education grade 3 program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/primary.webp",
  group: GY_PROGRAM_GROUP_PRIMARY,
};

export const GY_PRIMARY_GRADE_3_V1: StandardProgramVersion = {
  id: "gy-primary-grade-3-v1",
  program: GY_PRIMARY_GRADE_3_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  admission: {
    id: "gy-primary-grade-3-admission",
    eligibility: [
      {
        type: "age",
        description: "Child must be 7–8 years old by September 1st",
        ageRange: { minAgeYears: 7, maxAgeYears: 8 },
      },
    ],
    documents: [],
  },
};

export const GY_PRIMARY_GRADE_4_PROGRAM: StandardProgram = {
  id: "gy-primary-grade-4",
  name: "Grade 4",
  description:
    "Primary education grade 4 program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/primary.webp",
  group: GY_PROGRAM_GROUP_PRIMARY,
};

export const GY_PRIMARY_GRADE_4_V1: StandardProgramVersion = {
  id: "gy-primary-grade-4-v1",
  program: GY_PRIMARY_GRADE_4_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  admission: {
    id: "gy-primary-grade-4-admission",
    eligibility: [
      {
        type: "age",
        description: "Child must be 8–9 years old by September 1st",
        ageRange: { minAgeYears: 8, maxAgeYears: 9 },
      },
    ],
    documents: [],
  },
};

export const GY_PRIMARY_GRADE_5_PROGRAM: StandardProgram = {
  id: "gy-primary-grade-5",
  name: "Grade 5",
  description:
    "Primary education grade 5 program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/primary.webp",
  group: GY_PROGRAM_GROUP_PRIMARY,
};

export const GY_PRIMARY_GRADE_5_V1: StandardProgramVersion = {
  id: "gy-primary-grade-5-v1",
  program: GY_PRIMARY_GRADE_5_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  admission: {
    id: "gy-primary-grade-5-admission",
    eligibility: [
      {
        type: "age",
        description: "Child must be 9–10 years old by September 1st",
        ageRange: { minAgeYears: 9, maxAgeYears: 10 },
      },
    ],
    documents: [],
  },
};

export const GY_PRIMARY_GRADE_6_PROGRAM: StandardProgram = {
  id: "gy-primary-grade-6",
  name: "Grade 6",
  description:
    "Primary education grade 6 program under the Ministry of Education, Guyana",
  country: "GY",
  authority: "MoE-GY",
  image: "/orgs/defaults/programs/primary.webp",
  group: GY_PROGRAM_GROUP_PRIMARY,
};

export const GY_PRIMARY_GRADE_6_V1: StandardProgramVersion = {
  id: "gy-primary-grade-6-v1",
  program: GY_PRIMARY_GRADE_6_PROGRAM,
  version: 1,
  effectiveFrom: "2023-01-01",
  admission: {
    id: "gy-primary-grade-6-admission",
    eligibility: [
      {
        type: "age",
        description: "Child must be 10–11 years old by September 1st",
        ageRange: { minAgeYears: 10, maxAgeYears: 11 },
      },
    ],
    documents: [],
  },
  assessments: [GY_PRIMARY_ASSESSMENT_NGSA_V1],
};
