// Refactored ScoringBreakdown.tsx to match new RuleMetadata structure
"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Progress } from "@sovoli/ui/components/progress";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import {
  CheckCircleIcon,
  XCircleIcon,
  MessageCircleIcon,
  InfoIcon,
  ShieldCheckIcon,
  BarChartIcon,
  FileTextIcon,
  ServerCogIcon,
  PlayIcon,
  ClipboardCheckIcon,
  HelpCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";
import type { CategoryRuleSet, ScoringModule } from "../types";
import { Alert } from "@sovoli/ui/components/alert";
import { Chip } from "@sovoli/ui/components/chip";

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
              startContent={<GroupIcon className="text-primary" />}
              subtitle={
                <>
                  {groupPercentage < 100 && (
                    <Chip color="warning" size="sm" variant="light">
                      ({groupPercentage}%) Needs Attention
                    </Chip>
                  )}
                  {groupPercentage === 100 && (
                    <Chip color="success" size="sm" variant="light">
                      ({groupPercentage}%) Complete
                    </Chip>
                  )}
                </>
              }
              title={
                <div className="flex items-center justify-between w-full">
                  {group.label}
                </div>
              }
            >
              <div className="text-sm text-default-600 mb-3">
                {groupScore?.score} points earned out of {groupScore?.maxScore}
              </div>
              {group.description && (
                <p className="text-sm text-default-600 mb-3">
                  {group.description}
                </p>
              )}
              <div className="space-y-3">
                {group.rules
                  .map((ruleKey) => {
                    const scoredRule = ruleScores[ruleKey];
                    const ruleMetadata = ruleSet.ruleMetadata[ruleKey];

                    if (!ruleMetadata) return null;

                    const score = scoredRule?.score ?? 0;
                    const maxScore = scoredRule?.maxScore ?? 0;
                    const percent =
                      maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

                    return {
                      ruleKey,
                      ruleMetadata,
                      score,
                      maxScore,
                      percent,
                      isComplete: score === maxScore && maxScore > 0,
                    };
                  })
                  .filter(
                    (item): item is NonNullable<typeof item> => item !== null,
                  )
                  .sort((a, b) => {
                    // Sort incomplete rules first (by lowest score), then complete rules
                    if (!a.isComplete && !b.isComplete) {
                      return a.score - b.score; // Lowest score first
                    }
                    if (!a.isComplete && b.isComplete) {
                      return -1; // Incomplete rules first
                    }
                    if (a.isComplete && !b.isComplete) {
                      return 1; // Complete rules last
                    }
                    return 0; // Both complete, maintain order
                  })
                  .map(
                    ({
                      ruleKey,
                      ruleMetadata,
                      score,
                      maxScore,
                      percent,
                      isComplete,
                    }) => {
                      let state: "achieved" | "failed" | "warn" = "failed";
                      if (isComplete) state = "achieved";
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
                          {!isComplete && (
                            <Accordion>
                              <AccordionItem
                                aria-label="Improvement Guide"
                                startContent={
                                  <AlertTriangleIcon className="text-danger w-4 h-4" />
                                }
                                title={
                                  <span className="font-medium text-sm text-danger">
                                    Fix This Now
                                  </span>
                                }
                              >
                                <div className="space-y-3 mt-2">
                                  {/* Action Steps Section */}
                                  <Alert
                                    variant="solid"
                                    color="primary"
                                    hideIcon
                                    title={
                                      <div className="flex items-center gap-2">
                                        <PlayIcon className="w-4 h-4" />
                                        <span className="font-semibold text-sm">
                                          Action Steps
                                        </span>
                                      </div>
                                    }
                                    description={
                                      <ul className="space-y-2 mt-2">
                                        {ruleMetadata.actions.map(
                                          (action, idx) => (
                                            <li
                                              key={idx}
                                              className="flex items-start gap-2 text-sm"
                                            >
                                              {idx + 1}. {action}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    }
                                  />

                                  {/* Requirements Section */}
                                  <Alert
                                    variant="solid"
                                    color="warning"
                                    hideIcon
                                    title={
                                      <div className="flex items-center gap-2">
                                        <ClipboardCheckIcon className="w-4 h-4" />
                                        <span className="font-semibold text-sm">
                                          Requirements
                                        </span>
                                      </div>
                                    }
                                    description={
                                      <ul className="space-y-2 mt-2">
                                        {ruleMetadata.requirements.map(
                                          (requirement, idx) => (
                                            <li
                                              key={idx}
                                              className="flex items-start gap-2 text-sm"
                                            >
                                              ✓ {requirement}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    }
                                  />

                                  {/* Why This Matters Section */}
                                  <Alert
                                    variant="solid"
                                    color="secondary"
                                    hideIcon
                                    title={
                                      <div className="flex items-center gap-2">
                                        <HelpCircleIcon className="w-4 h-4" />
                                        <span className="font-semibold text-sm">
                                          Why This Matters
                                        </span>
                                      </div>
                                    }
                                    description={
                                      <ul className="space-y-2 mt-2">
                                        {ruleMetadata.reasons.map(
                                          (reason, idx) => (
                                            <li
                                              key={idx}
                                              className="flex items-start gap-2 text-sm"
                                            >
                                              ! {reason}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    }
                                  />
                                </div>
                              </AccordionItem>
                            </Accordion>
                          )}
                        </Card>
                      );
                    },
                  )}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
