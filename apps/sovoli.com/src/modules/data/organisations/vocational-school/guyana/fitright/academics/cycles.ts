import type { ProgramCycle } from "~/modules/academics/types";

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
  capacity: 6,
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
