import type {
  AcademicModule,
  OrgAcademicCycle,
  OrgProgram,
  OrgProgramCycle,
} from "~/modules/academics/types";
import {
  GY_CYCLE_2025_SUMMER,
  GY_CYCLE_2025_T1,
} from "~/modules/data/academics/guyana/cycles";
import {
  GY_NURSERY_V1,
  GY_PRIMARY_V1,
} from "~/modules/data/academics/guyana/programs";

const DOMINION_SCHOOL_BREAK_PROGRAM: OrgProgram = {
  name: "School Break Program",
  slug: "school-break",
  description: "Join us for Enriching Experiences and Educational Fun!",
  requirements: [
    {
      type: "age",
      ageRange: {
        minAgeYears: 5,
        maxAgeYears: 12,
      },
    },
  ],
};

const DOMINION_SCHOOL_NURSERY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_NURSERY_V1,
  slug: "nursery",
};

const DOMINION_SCHOOL_PRIMARY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_PRIMARY_V1,
  slug: "primary",
};

const DOMINON_SCHOOL_ACADEMIC_CYCLE_2025_T1: OrgAcademicCycle = {
  id: "dom-2025-t1",
  globalCycle: GY_CYCLE_2025_T1,
};

const DOMINION_SCHOOL_ACADEMIC_CYCLE_2025_SUMMER: OrgAcademicCycle = {
  id: "dom-2025-summer",
  globalCycle: GY_CYCLE_2025_SUMMER,
  startDate: "2025-14-07",
  endDate: "2025-31-07",
};

const DOMINION_SCHOOL_PROGRAM_CYCLE_2025_SUMMER: OrgProgramCycle = {
  id: "dom-2025-summer-nursery",
  orgProgram: DOMINION_SCHOOL_BREAK_PROGRAM,
  academicCycle: DOMINION_SCHOOL_ACADEMIC_CYCLE_2025_SUMMER,
  feeStructure: {
    fees: [
      {
        id: "tuition",
        label: "Tuition",
        billingCycle: "termly",
        amount: {
          GYD: 18000,
        },
        appliesTo: ["program"],
      },
    ],
  },
  computedRequirements: [...(DOMINION_SCHOOL_BREAK_PROGRAM.requirements ?? [])],
};

const DOMINION_SCHOOL_PROGRAM_CYCLE_2025_T1: OrgProgramCycle = {
  id: "dom-2025-t1-nursery",
  orgProgram: DOMINION_SCHOOL_NURSERY_PROGRAM,
  academicCycle: DOMINON_SCHOOL_ACADEMIC_CYCLE_2025_T1,
  feeStructure: {
    fees: [
      {
        id: "tuition",
        label: "Tuition",
        billingCycle: "termly",
        amount: { GYD: 60000 },
        appliesTo: ["program"],
      },
      {
        id: "registration",
        label: "Registration",
        billingCycle: "one-time",
        amount: { GYD: 5000 },
        appliesTo: ["application"],
      },
    ],
  },
  computedRequirements: [
    ...(DOMINION_SCHOOL_NURSERY_PROGRAM.standardProgramVersion?.requirements ??
      []),
  ],
};

export const DOMINION_SCHOOLS_ACADEMIC: AcademicModule = {
  programs: [
    DOMINION_SCHOOL_NURSERY_PROGRAM,
    DOMINION_SCHOOL_PRIMARY_PROGRAM,
    DOMINION_SCHOOL_BREAK_PROGRAM,
  ],
  programCycles: [
    DOMINION_SCHOOL_PROGRAM_CYCLE_2025_T1,
    DOMINION_SCHOOL_PROGRAM_CYCLE_2025_SUMMER,
  ],
};
