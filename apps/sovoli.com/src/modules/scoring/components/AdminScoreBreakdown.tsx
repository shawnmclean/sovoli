"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Progress } from "@sovoli/ui/components/progress";
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
import { Chip } from "@sovoli/ui/components/chip";
import { OrgRuleGroupIcon } from "./OrgRuleGroupIcon";

import type { OrgInstance } from "~/modules/organisations/types";
import { categoryRuleSets } from "../ruleSets";

export interface AdminScoreBreakdownProps {
  orgInstance: OrgInstance;
}

export function AdminScoreBreakdown({ orgInstance }: AdminScoreBreakdownProps) {
  const category = orgInstance.org.categories[0] ?? "private-school";
  const ruleSet = categoryRuleSets[category];

  if (!ruleSet || !orgInstance.scoringModule) return null;

  const { result } = orgInstance.scoringModule;

  const { ruleScores, scoreSummary } = result;
  const { totalScore, maxScore, groupScores } = scoreSummary;
  const percentage =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-1">
            <h1 className="text-base font-bold">Readiness Overview</h1>
            <p className="text-xs text-default-600">
              Based on Sovoli's visibility and info benchmarks
            </p>
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex justify-between text-xs text-default-500">
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>
          <Progress value={percentage} />
          <div className="flex justify-between text-xs font-medium text-default-700">
            <span>{totalScore} points earned</span>
            <span>{maxScore} total</span>
          </div>
        </CardBody>
      </Card>

      {/* Rules that need attention  */}

      <Accordion>
        {ruleSet.groups.map((group) => {
          const groupScore = groupScores[group.key];
          const groupPercentage =
            groupScore?.maxScore && groupScore.maxScore > 0
              ? Math.round((groupScore.score / groupScore.maxScore) * 100)
              : 0;
          const color = groupPercentage === 100 ? "success" : "warning";

          return (
            <AccordionItem
              key={group.key}
              aria-label={group.label}
              startContent={
                <OrgRuleGroupIcon
                  groupKey={group.key}
                  className={`${
                    color === "success" ? "text-success" : "text-warning"
                  }`}
                />
              }
              title={
                <div className="flex items-center justify-between w-full">
                  {group.label}
                </div>
              }
              subtitle={
                <Chip
                  color={color}
                  size="sm"
                  variant="light"
                  startContent={
                    groupPercentage === 100 ? (
                      <CheckCircleIcon size={12} />
                    ) : (
                      <AlertTriangleIcon size={12} />
                    )
                  }
                >
                  {groupScore?.score} of {groupScore?.maxScore}
                </Chip>
              }
            >
              <div className="space-y-4">
                <p className="text-sm text-default-600 leading-relaxed">
                  {group.description}
                </p>

                {/* Group Reasons */}
                {group.reasons.length > 0 && (
                  <div className="bg-warning-50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-warning-800 mb-3 flex items-center gap-2">
                      <HelpCircleIcon className="w-4 h-4" />
                      Why this matters
                    </h4>
                    <div className="space-y-2">
                      {group.reasons.map((reason, index) => (
                        <div
                          key={reason}
                          className="flex items-start gap-2 text-sm text-warning-700"
                        >
                          <span className="text-warning-500 font-medium mt-0.5">
                            {index + 1}.
                          </span>
                          <span className="leading-relaxed">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 mt-6">
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
                                    color="secondary"
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
                                      <ul className="mt-2 space-y-3 text-sm">
                                        {ruleMetadata.requirements.map(
                                          (req, idx) => (
                                            <li key={idx} className="space-y-2">
                                              {typeof req === "string" ? (
                                                <div className="flex items-start gap-2">
                                                  <span className="mt-0.5">
                                                    ✓
                                                  </span>
                                                  <span>{req}</span>
                                                </div>
                                              ) : (
                                                <div className="space-y-2">
                                                  <div className="flex items-start gap-2">
                                                    <span className="mt-0.5">
                                                      ✓
                                                    </span>
                                                    <span className="font-medium">
                                                      {req.label}
                                                    </span>
                                                  </div>
                                                  {req.description && (
                                                    <div className="pl-6 text-xs italic">
                                                      {req.description}
                                                    </div>
                                                  )}
                                                  <ul className="pl-6 space-y-1">
                                                    {req.items.map(
                                                      (item, itemIdx) => (
                                                        <li
                                                          key={itemIdx}
                                                          className="flex items-start gap-2"
                                                        >
                                                          <span className="text-xs mt-1">
                                                            •
                                                          </span>
                                                          <span>{item}</span>
                                                        </li>
                                                      ),
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    }
                                  />

                                  {/* Why This Matters Section */}
                                  <Alert
                                    variant="solid"
                                    color="warning"
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
}
