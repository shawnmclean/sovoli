import { Link } from "@sovoli/ui/components/link";
import { Info } from "lucide-react";
import React from "react";
import type {
  OrgCategoryKeys,
  OrgInstance,
} from "~/modules/organisations/types";
import { ScoringProgress } from "~/modules/scoring/components/ScoringProgress";
import { categoryRuleSets } from "~/modules/scoring/ruleSets";

interface ScoringSectionProps {
  orgInstance: OrgInstance;
  category: OrgCategoryKeys;
}

export const ScoringSection = ({
  orgInstance,
  category,
}: ScoringSectionProps) => {
  const { scoringModule, org } = orgInstance;

  if (!scoringModule) return null;

  const ruleSet = categoryRuleSets[category];
  if (!ruleSet) return null;

  return (
    <div className="mt-2 p-3 bg-default-100 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div />
        <Link
          href={`/${org.username}/scores`}
          color="primary"
          className="flex items-center gap-1 text-xs"
        >
          <Info className="w-4 h-4" />
          <span>See scoring breakdown</span>
        </Link>
      </div>
      <ScoringProgress scoringModule={scoringModule} ruleSet={ruleSet} />
    </div>
  );
};
