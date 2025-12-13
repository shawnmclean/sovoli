import type { ProgramCycle } from "~/modules/academics/types";
import { ALICIA_DAVIS } from "../workforce";

// Helper function to create a massage therapy cycle
// Duration: 3 Days per week (Wed, Thurs, Fri) - 7 Weeks
const createMassageTherapyCycle = (
  startDate: string,
  endDate: string,
  label: string,
  capacity = 10,
  enrolled = 0,
): ProgramCycle => ({
  id: `hew-massage-${startDate.replace(/-/g, "")}`,
  academicCycle: {
    id: `hew-massage-${startDate.replace(/-/g, "")}`,
    customLabel: label,
    startDate,
    endDate,
  },
  pricingPackage: {
    discounts: [],
    pricingItems: [
      {
        id: "registration",
        label: "Registration",
        billingCycle: "one-time",
        purpose: "registration",
        amount: { JMD: 3000 },
        notes:
          "Non-refundable registration fee. Covers administrative processing, course setup, and student onboarding.",
      },
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "program",
        amount: { JMD: 100000 },
      },
    ],
  },
  teachers: [ALICIA_DAVIS],
  capacity,
  enrolled,
});

// Massage Therapy Program cycles
// 3 Days per week (Wed, Thurs, Fri) - 7 Weeks - 3hrs per day
// Cost: $100,000 JMD

export const HEALING_EMERALD_MASSAGE_THERAPY_JANUARY_2026: ProgramCycle =
  createMassageTherapyCycle(
    "2026-01-07",
    "2026-02-25", // 7 weeks later
    "Massage Therapy - January 2026",
    2,
    0,
  );

export const HEALING_EMERALD_MASSAGE_THERAPY_FEBRUARY_2026: ProgramCycle =
  createMassageTherapyCycle(
    "2026-02-25",
    "2026-04-15", // 7 weeks later
    "Massage Therapy - February 2026",
    2,
    0,
  );

export const HEALING_EMERALD_MASSAGE_THERAPY_APRIL_2026: ProgramCycle =
  createMassageTherapyCycle(
    "2026-04-15",
    "2026-06-03", // 7 weeks later
    "Massage Therapy - April 2026",
    2,
    0,
  );

export const HEALING_EMERALD_MASSAGE_THERAPY_JUNE_2026: ProgramCycle =
  createMassageTherapyCycle(
    "2026-06-03",
    "2026-07-22", // 7 weeks later
    "Massage Therapy - June 2026",
    2,
    0,
  );

// Legacy export for backwards compatibility
export const HEALING_EMERALD_MASSAGE_THERAPY_CYCLE_1: ProgramCycle =
  HEALING_EMERALD_MASSAGE_THERAPY_JANUARY_2026;
