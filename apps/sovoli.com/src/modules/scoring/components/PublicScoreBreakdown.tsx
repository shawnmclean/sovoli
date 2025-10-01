"use client";

import React from "react";
import { Card } from "@sovoli/ui/components/card";
import { CircularProgress } from "@sovoli/ui/components/progress";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";

import { CheckCircleIcon, XCircleIcon } from "lucide-react";

import { OrgRuleGroupIcon } from "./OrgRuleGroupIcon";

import type { OrgInstance } from "~/modules/organisations/types";
import { categoryRuleSets } from "../ruleSets";
import { Button } from "@sovoli/ui/components/button";
import { Alert } from "@sovoli/ui/components/alert";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { config } from "~/utils/config";

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
                {(() => {
                  const ruleItems = group.rules
                    .map((ruleKey) => {
                      const scoredRule = ruleScores[ruleKey];
                      const ruleMetadata = ruleSet.ruleMetadata[ruleKey];

                      if (!ruleMetadata) return null;

                      const score = scoredRule?.score ?? 0;
                      const maxScore = scoredRule?.maxScore ?? 0;

                      return {
                        ruleKey,
                        ruleMetadata,
                        score,
                        maxScore,
                        isComplete: score === maxScore && maxScore > 0,
                      };
                    })
                    .filter(
                      (item): item is NonNullable<typeof item> => item !== null,
                    )
                    .sort((a, b) => {
                      // Sort complete rules first, then incomplete rules
                      if (a.isComplete && !b.isComplete) {
                        return -1; // Complete rules first
                      }
                      if (!a.isComplete && b.isComplete) {
                        return 1; // Incomplete rules last
                      }
                      return 0; // Both same status, maintain order
                    });

                  const incompleteRules = ruleItems.filter(
                    (item) => !item.isComplete,
                  );

                  return (
                    <>
                      {ruleItems.map(
                        ({ ruleKey, ruleMetadata, isComplete }) => {
                          let IconComponent = XCircleIcon;
                          let iconColor = "text-default-400";

                          if (isComplete) {
                            IconComponent = CheckCircleIcon;
                            iconColor = "text-success";
                          }

                          return (
                            <Card
                              key={ruleKey}
                              className={`p-3 ${!isComplete ? "opacity-60" : ""}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <IconComponent className={iconColor} />
                                <span
                                  className={`font-medium text-sm ${!isComplete ? "text-default-500" : ""}`}
                                >
                                  {ruleMetadata.label}
                                </span>
                              </div>
                              <div
                                className={`text-xs mb-2 ${!isComplete ? "text-default-400" : "text-default-600"}`}
                              >
                                {ruleMetadata.description}
                              </div>
                            </Card>
                          );
                        },
                      )}

                      {incompleteRules.length > 0 && (
                        <Alert
                          hideIcon
                          variant="faded"
                          color="primary"
                          title="Want the school to add this?"
                          endContent={
                            <Button
                              as={WhatsAppLink}
                              phoneNumber={
                                orgInstance.org.locations
                                  .find((location) => location.isPrimary)
                                  ?.contacts.find(
                                    (contact) => contact.type === "whatsapp",
                                  )?.value
                              }
                              message={`Hi, I’m a parent exploring schools. I noticed some info is missing on your Sovoli profile. You can view and update it here: ${config.url}/${orgInstance.org.username}/scores`}
                              size="sm"
                              variant="flat"
                              color="primary"
                              orgName={orgInstance.org.name}
                              orgId={orgInstance.org.username}
                              intent="Request Data"
                              role="parent"
                              page="scores"
                            >
                              Vote
                            </Button>
                          }
                        />
                      )}
                    </>
                  );
                })()}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
