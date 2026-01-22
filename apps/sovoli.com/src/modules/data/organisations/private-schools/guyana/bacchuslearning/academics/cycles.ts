import type { OrgAcademicCycle, ProgramCycle } from "~/modules/academics/types";
import type { Discount, PricingItem } from "~/modules/core/economics/types";
import { GY_CYCLE_2025_T1 } from "~/modules/data/academics/guyana/cycles";
import {
  BLOSSOM_JAMES,
  CLEANNA_LONDON,
  DENICIA_THOMAS,
  KISHANA_BECKLES,
  RENICIA_THOMAS,
  TREVA_MEUSA,
} from "../workforce";

// #region academic cycles

export const BLCGY_ACADEMIC_CYCLE_2025_T1: OrgAcademicCycle = {
  id: "blcgy-2025-t1",
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

const earlyBirdDiscount: Discount = {
  id: "early-bird",
  label: "Early Bird",
  message: "Early Bird discount",
  value: 100,
  type: "percentage",
  appliesTo: ["registration"],
  validUntil: "2025-07-18",
};

const noRegistrationDiscount: Discount = {
  id: "no-registration",
  label: "No Registration",
  message: "No Registration discount",
  value: 100,
  type: "percentage",
  appliesTo: ["registration"],
  validUntil: "2025-10-01",
};

const registrationPeriod2025T1 = {
  startDate: "2025-07-01",
  endDate: "2025-08-15",
};

export const BLCGY_NURSERY_YEAR_1_2025_T1: ProgramCycle = {
  id: "blcgy-nursery-year-1-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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
  teachers: [BLOSSOM_JAMES],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_NURSERY_YEAR_2_2025_T1: ProgramCycle = {
  id: "blcgy-nursery-year-2-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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
  teachers: [BLOSSOM_JAMES],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_PRIMARY_GRADE_1_2025_T1: ProgramCycle = {
  id: "blcgy-primary-grade-1-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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
  teachers: [KISHANA_BECKLES],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_PRIMARY_GRADE_2_2025_T1: ProgramCycle = {
  id: "blcgy-primary-grade-2-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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
  teachers: [KISHANA_BECKLES],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_PRIMARY_GRADE_3_2025_T1: ProgramCycle = {
  id: "blcgy-primary-grade-3-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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
  teachers: [CLEANNA_LONDON],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_PRIMARY_GRADE_4_2025_T1: ProgramCycle = {
  id: "blcgy-primary-grade-4-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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
  teachers: [CLEANNA_LONDON],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_PRIMARY_GRADE_5_2025_T1: ProgramCycle = {
  id: "blcgy-primary-grade-5-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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
  teachers: [TREVA_MEUSA],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_PRIMARY_GRADE_6_2025_T1: ProgramCycle = {
  id: "blcgy-primary-grade-6-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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
  teachers: [TREVA_MEUSA],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_SECONDARY_GRADE_7_2025_T1: ProgramCycle = {
  id: "blcgy-secondary-grade-7-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 70000 },
      },
    ],
  },
  teachers: [RENICIA_THOMAS],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_SECONDARY_GRADE_8_2025_T1: ProgramCycle = {
  id: "blcgy-secondary-grade-8-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 70000 },
      },
    ],
  },
  teachers: [RENICIA_THOMAS],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_SECONDARY_GRADE_9_2025_T1: ProgramCycle = {
  id: "blcgy-secondary-grade-9-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 70000 },
      },
    ],
  },
  teachers: [RENICIA_THOMAS],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_SECONDARY_GRADE_10_2025_T1: ProgramCycle = {
  id: "blcgy-secondary-grade-10-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 70000 },
      },
    ],
  },
  teachers: [DENICIA_THOMAS],
  capacity: 25,
  enrolled: 15,
};

export const BLCGY_SECONDARY_GRADE_11_2025_T1: ProgramCycle = {
  id: "blcgy-secondary-grade-11-2025-t1",
  academicCycle: BLCGY_ACADEMIC_CYCLE_2025_T1,
  registrationPeriod: registrationPeriod2025T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
    pricingItems: [
      registrationFee,
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "term",
        amount: { GYD: 70000 },
      },
    ],
  },
  teachers: [DENICIA_THOMAS],
  capacity: 25,
  enrolled: 15,
};
