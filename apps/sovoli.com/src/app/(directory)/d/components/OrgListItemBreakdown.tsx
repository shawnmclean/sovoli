"use client";

import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import type { OrgInstance } from "~/modules/organisations/types";
import { ScoringSection } from "~/modules/scoring/components/ScoringSection";
import { BarChartIcon } from "lucide-react";

export interface OrgListItemBreakdownProps {
  orgInstance: OrgInstance;
}

export function OrgListItemBreakdown({
  orgInstance,
}: OrgListItemBreakdownProps) {
  const { scoringModule } = orgInstance;
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
          <div className="flex items-center justify-between w-full">
            <span>Scoring</span>
            <span className="font-semibold text-sm">{scoreOutOf10} / 10</span>
          </div>
        }
      >
        <ScoringSection orgInstance={orgInstance} />
      </AccordionItem>
    </Accordion>
  );
}
