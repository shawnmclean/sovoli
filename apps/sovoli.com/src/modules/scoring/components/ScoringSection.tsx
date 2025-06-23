import React from "react";
import { Link } from "@sovoli/ui/components/link";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { Info } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import { ruleSets } from "~/modules/scoring/ruleSets";
import { ScoringProgress } from "~/modules/scoring/components/ScoringProgress";

interface ScoringSectionProps {
  orgInstance: OrgInstance;
}

export const ScoringSection = ({ orgInstance }: ScoringSectionProps) => {
  const { scoringModule, org } = orgInstance;

  if (!scoringModule) return null;

  const ruleSet = ruleSets[org.categories[0] ?? "private-school"];
  if (!ruleSet) return null;

  const totalScore = scoringModule.result.scoreSummary.totalScore;
  const maxScore = scoringModule.result.scoreSummary.maxScore;

  const scoreOutOf10 = maxScore
    ? Math.round((totalScore / maxScore) * 10 * 10) / 10
    : 0;

  return (
    <div className="mt-2 p-3 bg-default-100 rounded-lg">
      <div className="flex items-center mb-2 gap-2 justify-between">
        <span className="font-semibold text-sm">
          Score: {scoreOutOf10} / 10
        </span>
        <Tooltip content="View detailed scoring breakdown">
          <Link
            href={`/orgs/${org.username}/scores`}
            color="foreground"
            className="w-6 h-6 min-w-6"
          >
            <Info className="w-4 h-4" />
          </Link>
        </Tooltip>
      </div>
      <ScoringProgress scoringModule={scoringModule} ruleSet={ruleSet} />
    </div>
  );
};
