"use client";

import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import type { OrgInstance } from "~/modules/organisations/types";
import { ScoringSection } from "~/modules/scoring/components/ScoringSection";
import { BarChartIcon, BookOpenIcon } from "lucide-react";
import { Program } from "~/modules/academics/types";

export interface OrgListItemBreakdownProps {
  orgInstance: OrgInstance;
}

export function OrgListItemBreakdown({
  orgInstance,
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
            <span>{scoreOutOf10} / 10</span>
          </div>
        }
      >
        <ScoringSection orgInstance={orgInstance} />
      </AccordionItem>
      <AccordionItem
        key="programs"
        aria-label="Programs"
        startContent={<BookOpenIcon className="text-primary" />}
        title={
          <div className="flex items-center justify-between w-full text-sm">
            <span>Programs</span>
            <span>{academicModule?.programs.length ?? 0}</span>
          </div>
        }
      >
        <ProgramList programs={academicModule?.programs ?? []} />
      </AccordionItem>
    </Accordion>
  );
}

const ProgramList = ({ programs }: { programs: Program[] }) => {
  const formatAgeRange = (ageRange?: AgeRange) => {
    if (!ageRange) return null;

    const minAge = ageRange.minAgeYears || 0;
    const maxAge = ageRange.maxAgeYears || 0;

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

  const getAgeRequirement = (program: Program) => {
    const ageRequirement = program.requirements?.find(
      (req) => req.type === "age",
    );
    return ageRequirement?.ageRange;
  };

  return (
    <div className="space-y-2">
      {programs.map((program) => {
        const ageRange = getAgeRequirement(program);
        const formattedAge = formatAgeRange(ageRange);

        return (
          <div
            key={program.id}
            className="flex items-center justify-between p-2 rounded-lg bg-default-50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-default-900 truncate">
                {program.name}
              </p>
              {formattedAge && (
                <p className="text-xs text-default-500">Age: {formattedAge}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
