import type {
  ProgramAssessment,
  ProgramAssessmentVersion,
  StandardProgram,
  StandardProgramVersion,
} from "~/modules/academics/types";

// #region nursery
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
