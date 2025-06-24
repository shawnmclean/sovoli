// Refactored ScoringBreakdown.tsx to match new RuleMetadata structure
"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Progress } from "@sovoli/ui/components/progress";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import {
  CheckCircleIcon,
  XCircleIcon,
  LightbulbIcon,
  AlertCircleIcon,
  MessageCircleIcon,
  InfoIcon,
  ShieldCheckIcon,
  BarChartIcon,
  FileTextIcon,
  ServerCogIcon,
} from "lucide-react";
import type { CategoryRuleSet, ScoringModule } from "../types";

export interface ScoringBreakdownProps {
  scoringModule: ScoringModule;
  ruleSet: CategoryRuleSet;
}

const getGroupIcon = (groupKey: string) => {
  switch (groupKey) {
    case "visibility":
      return ShieldCheckIcon;
    case "transparency":
      return BarChartIcon;
    case "communication":
      return MessageCircleIcon;
    case "enrollment":
      return FileTextIcon;
    case "systems":
      return ServerCogIcon;
    default:
      return InfoIcon;
  }
};

export const ScoringBreakdown: React.FC<ScoringBreakdownProps> = ({
  scoringModule,
  ruleSet,
}) => {
  const { result } = scoringModule;
  const { ruleScores, scoreSummary } = result;
  const { totalScore, maxScore, groupScores } = scoreSummary;
  const percentage =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="pb-0">
          <h1 className="text-xl font-bold">Digital Readiness Score</h1>
        </CardHeader>
        <CardBody>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-default-600">Overall Progress</p>
            <p className="text-lg font-semibold">{percentage}%</p>
          </div>
          <Progress value={percentage} className="mb-4" />
          <div className="flex justify-between text-sm">
            <span>
              Score: {totalScore}/{maxScore}
            </span>
            <span>{percentage}% Complete</span>
          </div>
        </CardBody>
      </Card>

      <Accordion>
        {ruleSet.groups.map((group) => {
          const groupScore = groupScores[group.key];
          const groupPercentage =
            groupScore?.maxScore && groupScore.maxScore > 0
              ? Math.round((groupScore.score / groupScore.maxScore) * 100)
              : 0;
          const GroupIcon = getGroupIcon(group.key);

          return (
            <AccordionItem
              key={group.key}
              aria-label={group.label}
              title={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <GroupIcon className="text-primary" />
                    <span>{group.label}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">
                      {groupScore?.score ?? 0}/{groupScore?.maxScore ?? 0}
                    </span>
                    <span className="text-default-400 ml-2">
                      ({groupPercentage}%)
                    </span>
                  </div>
                </div>
              }
            >
              {group.description && (
                <p className="text-sm text-default-600 mb-3">
                  {group.description}
                </p>
              )}
              <div className="space-y-3">
                {group.rules.map((ruleKey) => {
                  const scoredRule = ruleScores[ruleKey];
                  const ruleMetadata = ruleSet.ruleMetadata[ruleKey];

                  if (!ruleMetadata) return null;

                  const score = scoredRule?.score ?? 0;
                  const maxScore = scoredRule?.maxScore ?? 0;
                  const percent =
                    maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

                  let state: "achieved" | "failed" | "warn" = "failed";
                  if (score === maxScore && maxScore > 0) state = "achieved";
                  else if (score > 0) state = "warn";

                  let IconComponent = XCircleIcon;
                  let iconColor = "text-default-400";
                  if (state === "achieved") {
                    IconComponent = CheckCircleIcon;
                    iconColor = "text-success";
                  } else if (state === "warn") {
                    IconComponent = CheckCircleIcon;
                    iconColor = "text-warning";
                  }

                  return (
                    <Card key={ruleKey} className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className={iconColor} />
                        <span className="font-medium text-sm">
                          {ruleMetadata.label}
                        </span>
                      </div>
                      <Progress
                        value={maxScore > 0 ? (score / maxScore) * 100 : 0}
                        label={`${score}/${maxScore} (${percent}%)`}
                        className="w-full mb-2"
                        size="sm"
                      />
                      <div className="text-xs text-default-600 mb-2">
                        {ruleMetadata.description}
                      </div>
                      {state !== "achieved" && (
                        <div className="bg-default-100 rounded p-2 mt-2 text-xs text-default-700">
                          <p className="font-semibold">What to do:</p>
                          <ul className="list-disc list-inside mt-1">
                            {ruleMetadata.actions.map((action, idx) => (
                              <li key={idx}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
