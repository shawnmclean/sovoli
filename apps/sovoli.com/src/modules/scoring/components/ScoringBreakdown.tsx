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
  ShieldIcon,
  UsersIcon,
  MessageCircleIcon,
  InfoIcon,
} from "lucide-react";
import type { CategoryRuleSet, ScoringModule, ViewAudience } from "../types";

export interface ScoringBreakdownProps {
  scoringModule: ScoringModule;
  ruleSet: CategoryRuleSet;
  audience?: "admin" | "parent";
}

const getGroupIcon = (groupKey: string) => {
  switch (groupKey) {
    case "trust":
      return ShieldIcon;
    case "curriculum":
      return UsersIcon;
    case "communication":
      return MessageCircleIcon;
    default:
      return InfoIcon;
  }
};

export const ScoringBreakdown: React.FC<ScoringBreakdownProps> = ({
  scoringModule,
  ruleSet,
  audience = "admin",
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
          const groupDescription =
            group.descriptions?.[audience as ViewAudience];

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
              {groupDescription && (
                <p className="text-sm text-default-600 mb-3">
                  {Array.isArray(groupDescription)
                    ? groupDescription.join(" ")
                    : groupDescription}
                </p>
              )}
              <div className="space-y-3">
                {group.rules.map((ruleKey) => {
                  const scoredRule = ruleScores[ruleKey];
                  const ruleMetadata = ruleSet.ruleMetadata[ruleKey];
                  const audienceView =
                    ruleMetadata?.audienceViews?.[audience as ViewAudience];

                  if (!ruleMetadata) return null;

                  const label =
                    audienceView?.label ?? ruleMetadata.defaultLabel;

                  const adminDescription =
                    ruleMetadata.audienceViews?.admin?.description ?? undefined;

                  const score = scoredRule?.score ?? 0;
                  const maxScore = scoredRule?.maxScore ?? 0;
                  const percent =
                    maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

                  let state: "achieved" | "failed" | "warn";
                  if (score === maxScore && maxScore > 0) {
                    state = "achieved";
                  } else if (score === 0) {
                    state = "failed";
                  } else {
                    state = "warn";
                  }

                  // Choose icon based on state
                  let IconComponent: React.ComponentType<{
                    className?: string;
                  }>;
                  let iconColor = "text-default-400";
                  if (state === "achieved") {
                    IconComponent = CheckCircleIcon;
                    iconColor = "text-success";
                  } else if (state === "warn") {
                    IconComponent = CheckCircleIcon;
                    iconColor = "text-warning";
                  } else {
                    IconComponent = XCircleIcon;
                    iconColor = "text-default-400";
                  }

                  return (
                    <Card key={ruleKey} className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className={iconColor} />
                        <span className="font-medium text-sm">{label}</span>
                      </div>
                      <Progress
                        value={maxScore > 0 ? (score / maxScore) * 100 : 0}
                        label={`${score}/${maxScore} (${percent}%)`}
                        className="w-full mb-2"
                        size="sm"
                      />
                      {(() => {
                        const parentDescription =
                          ruleMetadata.audienceViews?.parent?.description;
                        if (Array.isArray(parentDescription)) {
                          return (
                            <ul className="list-disc list-inside text-xs text-default-600 mb-1">
                              {parentDescription.map((desc, idx) => (
                                <li key={idx}>{desc}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <div className="text-xs text-default-600 mb-1">
                            {parentDescription}
                          </div>
                        );
                      })()}
                      {state !== "achieved" &&
                        audience === "admin" &&
                        adminDescription && (
                          <div className="bg-default-100 rounded p-2 mt-2 text-xs text-default-700">
                            <span className="font-semibold">Resolution:</span>{" "}
                            {Array.isArray(adminDescription) ? (
                              <ul className="list-disc list-inside mt-1">
                                {adminDescription.map((desc, idx) => (
                                  <li key={idx}>{desc}</li>
                                ))}
                              </ul>
                            ) : (
                              adminDescription
                            )}
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

      <Card className="bg-warning-50">
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <LightbulbIcon className="text-warning" />
            Recommendations
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {ruleSet.groups.flatMap((group) => {
              const groupScore = groupScores[group.key];
              const groupPercentage =
                groupScore?.maxScore && groupScore.maxScore > 0
                  ? Math.round((groupScore.score / groupScore.maxScore) * 100)
                  : 0;

              if (groupPercentage >= 100) return [];

              return group.rules
                .map((ruleKey) => {
                  const scoredRule = ruleScores[ruleKey];
                  const ruleMetadata = ruleSet.ruleMetadata[ruleKey];
                  const audienceView =
                    ruleMetadata?.audienceViews?.[audience as ViewAudience];

                  if (!ruleMetadata || !scoredRule || scoredRule.score > 0)
                    return null;

                  const label =
                    audienceView?.label ?? ruleMetadata.defaultLabel;
                  const description =
                    audienceView?.description ??
                    "This would improve your overall score.";

                  return (
                    <div key={ruleKey} className="flex items-start gap-2">
                      <AlertCircleIcon className="text-warning mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-default-600">
                          {Array.isArray(description)
                            ? description.join(" ")
                            : description}
                        </p>
                      </div>
                    </div>
                  );
                })
                .filter(Boolean);
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
