"use client";

import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import type {
  OrgCategoryKeys,
  OrgInstance,
} from "~/modules/organisations/types";
import { ScoringSection } from "~/modules/scoring/components/ScoringSection";
import { BarChartIcon, BookOpenIcon } from "lucide-react";
import type {
  AgeRange,
  OrgProgram,
  OrgProgramCycle,
} from "~/modules/academics/types";
import { Chip } from "@sovoli/ui/components/chip";

export interface OrgListItemBreakdownProps {
  orgInstance: OrgInstance;
  category: OrgCategoryKeys;
}

export function OrgListItemBreakdown({
  orgInstance,
  category,
}: OrgListItemBreakdownProps) {
  const { scoringModule, academicModule } = orgInstance;
  // get scoring count out of 10
  const totalScore = scoringModule?.result.scoreSummary.totalScore ?? 0;
  const maxScore = scoringModule?.result.scoreSummary.maxScore ?? 0;

  const scoreOutOf10 = maxScore
    ? Math.round((totalScore / maxScore) * 10 * 10) / 10
    : 0;

  return (
    <Accordion isCompact variant="bordered">
      <AccordionItem
        key="scoring"
        aria-label="Scoring"
        startContent={<BarChartIcon className="text-primary" />}
        title={
          <div className="flex items-center justify-between w-full text-sm">
            <span>Scoring</span>
            <Chip
              color={scoreOutOf10 >= 7 ? "success" : "warning"}
              size="sm"
              variant="light"
            >
              {scoreOutOf10}
            </Chip>
          </div>
        }
      >
        <ScoringSection orgInstance={orgInstance} category={category} />
      </AccordionItem>
      <AccordionItem
        key="programs"
        aria-label="Programs"
        startContent={<BookOpenIcon className="text-primary" />}
        title={
          <div className="flex items-center justify-between w-full text-sm">
            <span>Programs</span>
            <Chip color="default" size="sm" variant="light">
              {academicModule?.programs.length ?? 0}
            </Chip>
          </div>
        }
      >
        <ProgramList
          programs={academicModule?.programs ?? []}
          programCycles={academicModule?.programCycles ?? []}
        />
      </AccordionItem>
    </Accordion>
  );
}

const ProgramList = ({
  programs,
  programCycles,
}: {
  programs: OrgProgram[];
  programCycles: OrgProgramCycle[];
}) => {
  const formatAgeRange = (ageRange?: AgeRange) => {
    if (!ageRange) return null;

    const minAge = ageRange.minAgeYears ?? 0;
    const maxAge = ageRange.maxAgeYears ?? 0;

    if (minAge === maxAge) {
      return `${minAge} years`;
    } else if (minAge > 0 && maxAge > 0) {
      return `${minAge}-${maxAge} years`;
    } else if (minAge > 0) {
      return `${minAge}+ years`;
    } else if (maxAge > 0) {
      return `Up to ${maxAge} years`;
    }

    return null;
  };

  const getAgeRequirement = (program: OrgProgram) => {
    const ageRequirement =
      program.requirements?.find((req) => req.type === "age") ??
      program.standardProgramVersion?.requirements?.find(
        (req) => req.type === "age",
      );
    return ageRequirement?.ageRange;
  };

  const getProgramPricing = (program: OrgProgram) => {
    // Find program cycles that match this program
    const matchingCycles = programCycles.filter(
      (cycle) => cycle.orgProgram.slug === program.slug,
    );

    if (matchingCycles.length === 0) return null;

    // Get all tuition fees from matching cycles
    const tuitionFees: number[] = [];
    const registrationFees: number[] = [];

    matchingCycles.forEach((cycle) => {
      const tuitionFee = cycle.feeStructure?.fees.find((fee) =>
        fee.appliesTo.includes("program"),
      )?.amount.GYD;
      if (tuitionFee !== undefined && tuitionFee > 0) {
        tuitionFees.push(tuitionFee);
      }
      const registrationFee = cycle.feeStructure?.fees.find((fee) =>
        fee.appliesTo.includes("application"),
      )?.amount.GYD;
      if (registrationFee !== undefined && registrationFee > 0) {
        registrationFees.push(registrationFee);
      }
    });

    return {
      tuitionFees,
      registrationFees,
      billingCycle: matchingCycles[0]?.feeStructure?.fees[0]?.billingCycle,
    };
  };

  const formatCurrencyAmount = (amount: number): string => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`;
    }
    return amount.toString();
  };

  const formatPricing = (pricing: ReturnType<typeof getProgramPricing>) => {
    if (!pricing) return null;

    const parts: string[] = [];

    // Format tuition fees
    if (pricing.tuitionFees.length > 0) {
      const minTuition = Math.min(...pricing.tuitionFees);
      const maxTuition = Math.max(...pricing.tuitionFees);

      if (minTuition === maxTuition) {
        parts.push(`Tuition: GYD ${formatCurrencyAmount(minTuition)}`);
      } else {
        parts.push(
          `Tuition: GYD ${formatCurrencyAmount(minTuition)}-${formatCurrencyAmount(maxTuition)}`,
        );
      }
    }

    // Format registration fees
    if (pricing.registrationFees.length > 0) {
      const minReg = Math.min(...pricing.registrationFees);
      const maxReg = Math.max(...pricing.registrationFees);

      if (minReg === maxReg) {
        parts.push(`Reg: GYD ${formatCurrencyAmount(minReg)}`);
      } else {
        parts.push(
          `Reg: GYD ${formatCurrencyAmount(minReg)}-${formatCurrencyAmount(maxReg)}`,
        );
      }
    }

    // Add billing cycle if available
    if (pricing.billingCycle) {
      parts.push(`(${pricing.billingCycle})`);
    }

    return parts.join(" • ");
  };

  return (
    <div className="space-y-2">
      {programs.map((program) => {
        const ageRange = getAgeRequirement(program);
        const formattedAge = formatAgeRange(ageRange);
        const pricing = getProgramPricing(program);
        const formattedPricing = formatPricing(pricing);

        return (
          <div
            key={program.slug}
            className="flex items-center justify-between p-2 rounded-lg bg-default-50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-default-900 truncate">
                {program.name ??
                  program.standardProgramVersion?.program.name ??
                  ""}
              </p>
              <div className="flex flex-col gap-1 mt-1">
                {formattedAge && (
                  <p className="text-xs text-default-500">
                    Age: {formattedAge}
                  </p>
                )}
                {formattedPricing && (
                  <p className="text-xs text-default-500">{formattedPricing}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
