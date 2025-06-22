import React from "react";
import { Chip } from "@sovoli/ui/components/chip";
import type { CategoryRuleSet, ScoringModule } from "~/modules/scoring/types";
import { Shield, BookOpen, Phone, Monitor, Building2 } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trust: Shield,
  curriculum: BookOpen,
  communication: Phone,
  digital: Monitor,
  admin: Building2,
};

export interface ScoringChipsProps {
  type?: "slim" | "full";
  scoringModule: ScoringModule;
  ruleSet: CategoryRuleSet;
}

export const ScoringChips = ({
  type = "full",
  scoringModule,
  ruleSet,
}: ScoringChipsProps) => {
  const groupScores = scoringModule.result.scoreSummary.groupScores;

  return (
    <div className="flex flex-wrap gap-1">
      {ruleSet.groups.map((group) => {
        const scoreData = groupScores[group.key];
        const IconComponent = ICONS[group.key] ?? Shield;
        const label = group.label;

        const score = scoreData?.score ?? 0;
        const maxScore = scoreData?.maxScore ?? 0;
        const percent = maxScore ? (score / maxScore) * 100 : 0;

        const color =
          percent >= 80 ? "success" : percent >= 50 ? "warning" : "default";

        return (
          <Chip
            key={group.key}
            size="sm"
            color={color}
            variant="flat"
            className="text-xs flex items-center gap-1"
            title={`${label} – ${score}/${maxScore}`}
            startContent={<IconComponent className="w-3 h-3 fill-current" />}
          >
            {type === "full" && (
              <span>{label.split("&")[0]?.trim() ?? ""}</span>
            )}
            <span className="text-[10px]">
              {maxScore} / {score}
            </span>
          </Chip>
        );
      })}
    </div>
  );
};
