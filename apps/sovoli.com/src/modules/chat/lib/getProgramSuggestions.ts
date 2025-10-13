import type { Program, ProgramCycle } from "~/modules/academics/types";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  notes?: string;
}

function getCurrentCycle(
  cycles: ProgramCycle[] | undefined,
): ProgramCycle | undefined {
  if (!cycles || cycles.length === 0) return undefined;

  const now = new Date();

  // Find the cycle that contains the current date
  return cycles.find((cycle) => {
    // Get the cycle dates - check custom dates first, then global cycle dates
    const startDateStr =
      cycle.academicCycle.startDate ??
      cycle.academicCycle.globalCycle?.startDate;
    const endDateStr =
      cycle.academicCycle.endDate ?? cycle.academicCycle.globalCycle?.endDate;

    if (!startDateStr || !endDateStr) return false;

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    return now >= start && now <= end;
  });
}

export interface ProgramSuggestion {
  familyMemberId: string;
  familyMemberName: string;
  programs: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    ageRange?: string;
    price?: number;
    currency?: string;
    billingCycle?: string;
    imageUrl?: string;
  }[];
}

function getAdmissionAgeRange(program: Program): {
  minAge?: number;
  maxAge?: number;
} {
  // Try to extract age from admission policy
  const admission =
    program.admission ?? program.standardProgramVersion?.admission;
  if (admission?.eligibility && admission.eligibility.length > 0) {
    const ageEligibility = admission.eligibility[0];
    if (ageEligibility?.ageRange) {
      const range = ageEligibility.ageRange;
      return {
        minAge: range.minAgeYears,
        maxAge: range.maxAgeYears,
      };
    }
  }

  // Try to infer from standard program version ID
  if (program.standardProgramVersion) {
    const programId = program.standardProgramVersion.program.id;
    // Map common grade levels to ages (this is a simplified mapping)
    const gradeToAge: Record<string, { minAge: number; maxAge: number }> = {
      nursery: { minAge: 2, maxAge: 4 },
      "pre-kg": { minAge: 3, maxAge: 4 },
      kg1: { minAge: 4, maxAge: 5 },
      kg2: { minAge: 5, maxAge: 6 },
      "grade-1": { minAge: 6, maxAge: 7 },
      "grade-2": { minAge: 7, maxAge: 8 },
      "grade-3": { minAge: 8, maxAge: 9 },
      "grade-4": { minAge: 9, maxAge: 10 },
      "grade-5": { minAge: 10, maxAge: 11 },
      "grade-6": { minAge: 11, maxAge: 12 },
      "grade-7": { minAge: 12, maxAge: 13 },
      "grade-8": { minAge: 13, maxAge: 14 },
      "grade-9": { minAge: 14, maxAge: 15 },
      "grade-10": { minAge: 15, maxAge: 16 },
      "grade-11": { minAge: 16, maxAge: 17 },
      "grade-12": { minAge: 17, maxAge: 18 },
    };

    if (gradeToAge[programId]) {
      return gradeToAge[programId];
    }
  }

  return {};
}

function filterProgramsByAge(programs: Program[], age: number): Program[] {
  return programs.filter((program) => {
    const ageRange = getAdmissionAgeRange(program);

    // If we have age range info, use it
    if (ageRange.minAge !== undefined || ageRange.maxAge !== undefined) {
      const minAge = ageRange.minAge ?? 0;
      const maxAge = ageRange.maxAge ?? 100;
      return age >= minAge && age <= maxAge;
    }

    // If no age info, include the program (let user decide)
    return true;
  });
}

export function getProgramSuggestions(
  programs: Program[],
  familyMembers: FamilyMember[],
): ProgramSuggestion[] {
  return familyMembers.map((member) => {
    const matchingPrograms = filterProgramsByAge(programs, member.age);

    return {
      familyMemberId: member.id,
      familyMemberName: member.name,
      programs: matchingPrograms.map((program) => {
        const ageRange = getAdmissionAgeRange(program);
        const ageRangeStr =
          ageRange.minAge !== undefined && ageRange.maxAge !== undefined
            ? `${ageRange.minAge}-${ageRange.maxAge} years`
            : undefined;

        // Get pricing from the current cycle based on dates
        const currentCycle = getCurrentCycle(program.cycles);
        const pricingItems = currentCycle?.pricingPackage.pricingItems;
        const pricingItem = pricingItems?.[0];
        const tuitionItem = pricingItems?.find(
          (item) => item.purpose === "tuition",
        );
        const itemToUse = tuitionItem ?? pricingItem;

        // Get the first currency value from the amount
        const amount = itemToUse?.amount;
        const currency = amount
          ? (Object.keys(amount)[0] as keyof typeof amount)
          : undefined;
        const priceValue = currency && amount ? amount[currency] : undefined;
        const billingCycle = itemToUse?.billingCycle;

        return {
          id: program.id,
          slug: program.slug,
          name:
            program.name ??
            program.standardProgramVersion?.program.name ??
            program.slug,
          description: program.description ?? program.tagline,
          ageRange: ageRangeStr,
          price: priceValue,
          currency: currency,
          billingCycle: billingCycle,
          imageUrl:
            program.photos?.[0]?.url ??
            program.standardProgramVersion?.program.image,
        };
      }),
    };
  });
}
