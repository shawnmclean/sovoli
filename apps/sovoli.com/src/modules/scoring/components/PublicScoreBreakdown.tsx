"use client";

import React from "react";
import { Card } from "@sovoli/ui/components/card";
import { CircularProgress, Progress } from "@sovoli/ui/components/progress";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";

import {
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  ClipboardCheckIcon,
  HelpCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";

import { Alert } from "@sovoli/ui/components/alert";
import { OrgRuleGroupIcon } from "./OrgRuleGroupIcon";

import type { OrgInstance } from "~/modules/organisations/types";
import { categoryRuleSets } from "../ruleSets";

export interface PublicScoreBreakdownProps {
  orgInstance: OrgInstance;
}

export function PublicScoreBreakdown({
  orgInstance,
}: PublicScoreBreakdownProps) {
  const category = orgInstance.org.categories[0] ?? "private-school";
  const ruleSet = categoryRuleSets[category];

  if (!ruleSet || !orgInstance.scoringModule) return null;

  const { result } = orgInstance.scoringModule;

  const { ruleScores, scoreSummary } = result;
  const { groupScores } = scoreSummary;

  return (
    <div className="space-y-4">
      <Accordion>
        {ruleSet.groups.map((group) => {
          const groupScore = groupScores[group.key];
          const groupPercentage =
            groupScore?.maxScore && groupScore.maxScore > 0
              ? Math.round((groupScore.score / groupScore.maxScore) * 100)
              : 0;
          const color = groupPercentage === 100 ? "success" : "warning";
          const isIncomplete = groupPercentage < 100;

          const scoreOutOf10 = groupScore?.maxScore
            ? Math.round((groupScore.score / groupScore.maxScore) * 10 * 10) /
              10
            : 0;

          return (
            <AccordionItem
              key={group.key}
              aria-label={group.label}
              data-incomplete={isIncomplete}
              startContent={
                <CircularProgress
                  value={scoreOutOf10}
                  color={color}
                  title={`${group.label} – ${scoreOutOf10}/10`}
                  showValueLabel
                  size="sm"
                  formatOptions={{ maximumFractionDigits: 1 }}
                  maxValue={10}
                />
              }
              title={
                <div className="flex items-center w-full gap-2">
                  <OrgRuleGroupIcon
                    groupKey={group.key}
                    className={`${
                      color === "success" ? "text-success" : "text-warning"
                    }`}
                  />
                  {group.label}
                </div>
              }
            >
              <p className="text-sm text-default-600 mb-3">
                {group.description}
              </p>

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
                          <div className="text-xs text-default-600 mb-2">
                            {ruleMetadata.description}
                          </div>
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
}
