import type { ProgramCycle } from "~/modules/academics/types";
import { XAVIRINE_DORNELLAS } from "../workforce";

// Helper function to create a cycle with a specific date
const createFitrightCycle = (day: number, enrolled: number): ProgramCycle => ({
  id: `fr-cycle-july${day}`,
  academicCycle: {
    id: `fr-cycle-july${day}`,
    customLabel: `July ${day} - 10AM - 4PM`,
    startDate: `2025-07-${day.toString().padStart(2, "0")}`,
    endDate: `2025-07-${day.toString().padStart(2, "0")}`,
  },
  pricingPackage: {
    discounts: [],
    pricingItems: [
      {
        id: "tuition",
        label: "Materials",
        purpose: "materials",
        billingCycle: "one-time",
        amount: { GYD: 8000 },
      },
    ],
  },
  teachers: [XAVIRINE_DORNELLAS],
  capacity: 6,
  enrolled,
});

// Helper function to create a cycle with date range
const createFitrightDateRangeCycle = (
  level: string,
  startDate: string,
  endDate: string,
  capacity = 10,
  enrolled = 0,
): ProgramCycle => ({
  id: `fr-${level.toLowerCase()}-sewing-${startDate.split("-")[1]}-${startDate.split("-")[2]}`,
  academicCycle: {
    id: `fr-${level.toLowerCase()}-sewing-${startDate.split("-")[1]}-${startDate.split("-")[2]}`,
    customLabel: `${level}`,
    startDate,
    endDate,
  },
  pricingPackage: {
    discounts: [],
    pricingItems: [
      {
        id: "registration",
        label: "Registration",
        purpose: "registration",
        billingCycle: "one-time",
        amount: { GYD: 5000 },
      },
      {
        id: "tuition",
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "one-time",
        amount: { GYD: 65000 },
      },
    ],
  },
  teachers: [XAVIRINE_DORNELLAS],
  capacity,
  enrolled,
});

export const FITRIGHT_BAG_WORKSHOP_JULY_25: ProgramCycle = createFitrightCycle(
  25,
  4,
);
export const FITRIGHT_BAG_WORKSHOP_JULY_26: ProgramCycle = createFitrightCycle(
  26,
  2,
);
export const FITRIGHT_BAG_WORKSHOP_JULY_27: ProgramCycle = createFitrightCycle(
  27,
  1,
);

export const FITRIGHT_ELEMENTARY_SEWING_SEPTEMBER_2025: ProgramCycle =
  createFitrightDateRangeCycle(
    "Elementary Sewing - Sept 2025",
    "2025-09-15",
    "2025-10-03",
    10,
    2,
  );

export const FITRIGHT_INTERMEDIATE_SEWING_OCTOBER_2025: ProgramCycle =
  createFitrightDateRangeCycle(
    "Intermediate Sewing - Oct 2025",
    "2025-10-06",
    "2025-10-31",
    10,
    2,
  );

export const FITRIGHT_ADVANCED_SEWING_NOVEMBER_2025: ProgramCycle =
  createFitrightDateRangeCycle(
    "Advanced Sewing - Nov 2025",
    "2025-11-03",
    "2025-11-28",
    10,
    2,
  );
