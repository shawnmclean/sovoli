import React from "react";
import { Link } from "@sovoli/ui/components/link";
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

  return (
    <div className="mt-2 p-3 bg-default-100 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div />
        <Link
          href={`/orgs/${org.username}/scores`}
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
