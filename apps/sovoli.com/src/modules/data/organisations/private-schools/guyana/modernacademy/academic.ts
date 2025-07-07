import type {
  AcademicModule,
  OrgAcademicCycle,
  OrgProgram,
  OrgProgramCycle,
} from "~/modules/academics/types";
import type { Discount, PricingItem } from "~/modules/core/economics/types";
import { GY_CYCLE_2025_T1 } from "~/modules/data/academics/guyana/cycles";
import {
  GY_NURSERY_V1,
  GY_PRIMARY_V1,
  GY_SECONDARY_V1,
} from "~/modules/data/academics/guyana/programs";

// #region programs

export const MAGY_PRE_NURSERY_PROGRAM: OrgProgram = {
  slug: "pre-nursery",
  name: "Pre-Nursery (Playschool)",
  description: "Strong foundational learning in a nurturing environment",
  image: "/orgs/private-schools/guyana/modernacademy/programs/pre-nursery.webp",
  requirements: [
    {
      type: "age",
      ageRange: {
        minAgeYears: 2,
      },
    },
  ],
};
export const MAGY_NURSERY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_NURSERY_V1,
  slug: "nursery",
  description: "Engaging curriculum fostering critical thinking and creativity",
  image: "/orgs/private-schools/guyana/modernacademy/programs/nursery.webp",
};

export const MAGY_PRIMARY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_PRIMARY_V1,
  slug: "primary",
  description: "Strong foundational learning in a nurturing environment",
  image: "/orgs/private-schools/guyana/modernacademy/programs/primary.webp",
};

export const MAGY_SECONDARY_PROGRAM: OrgProgram = {
  standardProgramVersion: GY_SECONDARY_V1,
  slug: "secondary",
  description: "Engaging curriculum fostering critical thinking and creativity",
  image: "/orgs/private-schools/guyana/modernacademy/programs/secondary.webp",
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
  validUntil: "2025-08-15",
};

const registrationPeriod2025T1 = {
  startDate: "2025-07-01",
  endDate: "2025-08-31",
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
