import { GY_CYCLE_2025_T1 } from "~/modules/data/academics/guyana/cycles";
import type { OrgAcademicCycle, ProgramCycle } from "~/modules/academics/types";
import type { Discount, PricingItem } from "~/modules/core/economics/types";
import {
  ANITA_DHANIRAM,
  MOLTA_MCRAE,
  SAMANTHA_PERSAUD,
  SIR_CHABEERAJ_FRANCIS,
  WONDA_BARON,
} from "../workforce";
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

export const MAGY_PRE_NURSERY_2025_T1: ProgramCycle = {
  id: "magy-pre-nursery-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
  pricingPackage: {
    discounts: [earlyBirdDiscount, noRegistrationDiscount],
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

  teachers: [ANITA_DHANIRAM],
  capacity: 25,
  enrolled: 18,
};

export const MAGY_NURSERY_YEAR_1_2025_T1: ProgramCycle = {
  id: "magy-nursery-year-1-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
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

  teachers: [SAMANTHA_PERSAUD],
  capacity: 25,
  enrolled: 15,
};

export const MAGY_NURSERY_YEAR_2_2025_T1: ProgramCycle = {
  id: "magy-nursery-year-2-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
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

  teachers: [SAMANTHA_PERSAUD],
  capacity: 25,
  enrolled: 15,
};

export const MAGY_PRIMARY_GRADE_1_2025_T1: ProgramCycle = {
  id: "magy-primary-grade-1-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
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

  teachers: [WONDA_BARON],
  capacity: 25,
  enrolled: 15,
};

export const MAGY_PRIMARY_GRADE_2_2025_T1: ProgramCycle = {
  id: "magy-primary-grade-2-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
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

  teachers: [WONDA_BARON],
  capacity: 25,
  enrolled: 15,
};

export const MAGY_PRIMARY_GRADE_3_2025_T1: ProgramCycle = {
  id: "magy-primary-grade-3-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
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

  teachers: [MOLTA_MCRAE],
  capacity: 25,
  enrolled: 15,
};

export const MAGY_PRIMARY_GRADE_4_2025_T1: ProgramCycle = {
  id: "magy-primary-grade-4-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
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

  teachers: [MOLTA_MCRAE],
  capacity: 25,
  enrolled: 15,
};

export const MAGY_PRIMARY_GRADE_5_2025_T1: ProgramCycle = {
  id: "magy-primary-grade-5-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
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

  teachers: [SIR_CHABEERAJ_FRANCIS],
  capacity: 25,
  enrolled: 15,
};

export const MAGY_PRIMARY_GRADE_6_2025_T1: ProgramCycle = {
  id: "magy-primary-grade-6-2025-t1",
  academicCycle: MAGY_ACADEMIC_CYCLE_2025_T1,
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

  teachers: [SIR_CHABEERAJ_FRANCIS],
  capacity: 25,
  enrolled: 15,
};
