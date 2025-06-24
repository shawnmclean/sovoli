import React from "react";
import { CircularProgress } from "@sovoli/ui/components/progress";
import type { CategoryRuleSet, ScoringModule } from "~/modules/scoring/types";
import { Shield, BookOpen, Phone, Monitor, Building2 } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trust: Shield,
  curriculum: BookOpen,
  communication: Phone,
  digital: Monitor,
  admin: Building2,
};

export interface ScoringProgressProps {
  type?: "slim" | "full";
  scoringModule: ScoringModule;
  ruleSet: CategoryRuleSet;
}

export const ScoringProgress = ({
  scoringModule,
  ruleSet,
}: ScoringProgressProps) => {
  const groupScores = scoringModule.result.scoreSummary.groupScores;

  return (
    <div className="flex flex-col gap-3">
      {ruleSet.groups.map((group) => {
        const scoreData = groupScores[group.key];
        const IconComponent = ICONS[group.key] ?? Shield;
        const label = group.label;

        const score = scoreData?.score ?? 0;
        const maxScore = scoreData?.maxScore ?? 0;
        const percent = maxScore ? (score / maxScore) * 100 : 0;

        // Calculate score out of 10
        const scoreOutOf10 = maxScore
          ? Math.round((score / maxScore) * 10 * 10) / 10
          : 0;

        const color =
          percent >= 80 ? "success" : percent >= 50 ? "warning" : "default";

        return (
          <div
            key={group.key}
            className="flex items-center justify-between gap-3 p-2 rounded-lg bg-default-50"
          >
            <CircularProgress
              value={scoreOutOf10}
              color={color}
              title={`${label} – ${scoreOutOf10}/10`}
              showValueLabel
              size="sm"
              formatOptions={{ maximumFractionDigits: 1 }}
              maxValue={10}
            />
            <div className="flex items-center gap-2 flex-1">
              <IconComponent
                className={`w-4 h-4 ${
                  color === "success"
                    ? "text-success"
                    : color === "warning"
                      ? "text-warning"
                      : "text-default"
                }`}
              />
              <span className="text-sm font-medium capitalize">
                {group.key}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
