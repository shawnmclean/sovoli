import type {
  AcademicModule,
  OrgAcademicCycle,
  OrgProgram,
  OrgProgramCycle,
} from "~/modules/academics/types";
import { GY_CYCLE_2025_T1 } from "~/modules/data/academics/guyana/cycles";
import {
  GY_NURSERY_V1,
  GY_PRIMARY_V1,
  GY_SECONDARY_V1,
} from "~/modules/data/academics/guyana/programs";

// #region programs

export const MAGY_PRE_NURSERY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_NURSERY_V1,
  slug: "pre-nursery",
  image: "/orgs/private-schools/guyana/modernacademy/pre-nursery.webp",
};
export const MAGY_NURSERY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_NURSERY_V1,
  slug: "nursery",
  image: "/orgs/private-schools/guyana/modernacademy/nursery.webp",
};

export const MAGY_PRIMARY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_PRIMARY_V1,
  slug: "primary",
  image: "/orgs/private-schools/guyana/modernacademy/primary.webp",
};

export const MAGY_SECONDARY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_SECONDARY_V1,
  slug: "secondary",
  image: "/orgs/private-schools/guyana/modernacademy/secondary.webp",
};

// #endregion

// #region academic cycles

export const MAGY_ACADEMIC_CYCLE_2025_T1: OrgAcademicCycle = {
  id: "magy-2025-t1",
  globalCycle: GY_CYCLE_2025_T1,
  customLabel: "Term 1 2025",
  startDate: "2025-01-01",
  endDate: "2025-03-31",
};

// #endregion

// #region program cycles

export const MAGY_PRE_NURSERY_2025_T1: OrgProgramCycle = {
  id: "magy-pre-nursery-2025-t1",
  orgProgram: MAGY_PRE_NURSERY_PROGRAM,
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  feeStructure: {
    tuitionFee: { GYD: 15000 },
    registrationFee: { GYD: 5000 },
    billingCycle: "termly",
  },
  computedRequirements: [
    ...(MAGY_PRE_NURSERY_PROGRAM.standardProgramVersion?.requirements ?? []),
  ],
};

export const MAGY_NURSERY_2025_T1: OrgProgramCycle = {
  id: "magy-nursery-2025-t1",
  orgProgram: MAGY_NURSERY_PROGRAM,
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  feeStructure: {
    tuitionFee: { GYD: 15000 },
    registrationFee: { GYD: 5000 },
    billingCycle: "termly",
  },
  computedRequirements: [
    ...(MAGY_NURSERY_PROGRAM.standardProgramVersion?.requirements ?? []),
  ],
};

export const MAGY_PRIMARY_2025_T1: OrgProgramCycle = {
  id: "magy-primary-2025-t1",
  orgProgram: MAGY_PRIMARY_PROGRAM,
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  feeStructure: {
    tuitionFee: { GYD: 15000 },
    registrationFee: { GYD: 5000 },
    billingCycle: "termly",
  },
  computedRequirements: [
    ...(MAGY_PRIMARY_PROGRAM.standardProgramVersion?.requirements ?? []),
  ],
};

export const MAGY_SECONDARY_2025_T1: OrgProgramCycle = {
  id: "magy-secondary-2025-t1",
  orgProgram: MAGY_SECONDARY_PROGRAM,
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  feeStructure: {
    tuitionFee: { GYD: 15000 },
    registrationFee: { GYD: 5000 },
    billingCycle: "termly",
  },
  computedRequirements: [
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
