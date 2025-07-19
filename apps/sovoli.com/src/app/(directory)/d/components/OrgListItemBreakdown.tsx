"use client";

import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import type {
  OrgCategoryKeys,
  OrgInstance,
} from "~/modules/organisations/types";
import { ScoringSection } from "~/modules/scoring/components/ScoringSection";
import { BarChartIcon, BookOpenIcon } from "lucide-react";
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
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {orgInstance.academicModule?.programs.map((program) => (
              <div key={program.id}>{program.name}</div>
            ))}
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
