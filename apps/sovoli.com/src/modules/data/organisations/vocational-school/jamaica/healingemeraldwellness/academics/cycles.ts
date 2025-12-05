import type { ProgramCycle } from "~/modules/academics/types";

// Helper function to create a massage therapy cycle
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
				id: "tuition",
				label: "Tuition",
				purpose: "tuition",
				billingCycle: "program",
				amount: { JMD: 0 }, // Price TBD
			},
		],
	},
	// Teachers will be resolved from workforce module
	teachers: [],
	capacity,
	enrolled,
});

// Massage Therapy cycles - dates to be announced
export const HEALING_EMERALD_MASSAGE_THERAPY_CYCLE_1: ProgramCycle =
	createMassageTherapyCycle(
		"2025-01-01", // TBD
		"2025-03-31", // TBD
		"Massage Therapy - Intake TBA",
		10,
		0,
	);
