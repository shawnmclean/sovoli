"use client";

import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardListIcon,
  RocketIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "lucide-react";
import React, { useState } from "react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgInstance } from "~/modules/organisations/types";
import { pluralize } from "~/utils/pluralize";
import { categoryRuleSets } from "../ruleSets";
import type { RuleKey } from "../rules";
import type { RuleScoreMap, ScoredRule } from "../types";
import { OrgRuleGroupIcon } from "./OrgRuleGroupIcon";

export interface RulesAttentionSummaryProps {
  orgInstance: OrgInstance;
}

export function RulesAttentionSummary({
  orgInstance,
}: RulesAttentionSummaryProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Get the rule set for the org's category
  const category = orgInstance.org.categories[0] ?? "private-school";
  const ruleSet = categoryRuleSets[category];

  // If no rule set or no scoring module, don't render anything
  if (!ruleSet || !orgInstance.scoringModule) {
    return null;
  }

  // Extract rules that need attention (incomplete rules)
  const rulesThatNeedAttention: RuleScoreMap = Object.fromEntries(
    ruleSet.groups
      .flatMap((group) => group.rules)
      .reduce<[string, ScoredRule][]>((acc, ruleKey) => {
        const scoredRule =
          orgInstance.scoringModule?.result.ruleScores[ruleKey];
        const isIncomplete =
          scoredRule &&
          scoredRule.maxScore > 0 &&
          scoredRule.score !== scoredRule.maxScore;

        if (isIncomplete) {
          acc.push([ruleKey, scoredRule]);
        }
        return acc;
      }, []),
  );

  // If no rules need attention, don't render anything
  if (Object.keys(rulesThatNeedAttention).length === 0) {
    return null;
  }

  const incompleteRules = Object.entries(rulesThatNeedAttention)
    .map(([ruleKey]) => {
      const typedRuleKey = ruleKey as RuleKey;
      const ruleMetadata = ruleSet.ruleMetadata[typedRuleKey];
      if (!ruleMetadata) return null;

      return {
        ruleKey: typedRuleKey,
        ruleMetadata,
        score: rulesThatNeedAttention[typedRuleKey]?.maxScore ?? 0,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Group incomplete rules by their groups
  const groupedIncompleteRules = ruleSet.groups
    .map((group) => {
      const groupRules = incompleteRules.filter((rule) =>
        group.rules.includes(rule.ruleKey),
      );

      if (groupRules.length === 0) return null;

      return {
        group,
        rules: groupRules,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const incompleteRulesCount = incompleteRules.length;

  const totalScoreBoost = incompleteRules
    .filter(({ ruleMetadata }) => ruleMetadata.includedInPlan.length > 0)
    .reduce((sum, { score }) => sum + score, 0);

  return (
    <div className="space-y-3">
      <Alert
        hideIcon
        variant="faded"
        color="warning"
        className="p-2"
        title={
          <div className="flex justify-between items-center w-full">
            <div className="inline-flex items-center gap-2 text-base font-semibold">
              <ClipboardListIcon className="w-4 h-4 text-warning-600" />
              {incompleteRulesCount} {pluralize(incompleteRulesCount, "item")}{" "}
              need attention
            </div>
            <Chip
              color="warning"
              size="sm"
              variant="light"
              className="text-xs font-medium tracking-wide"
              startContent={
                <ShieldCheckIcon className="w-3.5 h-3.5 text-warning-600" />
              }
            >
              Admin
            </Chip>
          </div>
        }
      >
        <div className="flex items-center mt-3">
          <Button
            size="sm"
            variant="light"
            color="warning"
            className="flex items-center gap-1 p-0 bg-transparent"
            disableRipple
            onPress={() => setShowDetails(!showDetails)}
            endContent={
              showDetails ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )
            }
          >
            {showDetails ? "Hide" : "View summary"}
          </Button>
        </div>

        {showDetails && (
          <div className="mt-4 w-full">
            <div className="space-y-6">
              {groupedIncompleteRules.map(({ group, rules: groupRules }) => (
                <div key={group.key} className="space-y-3">
                  {/* Group Badge with Horizontal Line */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-default-200"></div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-default-50 border border-default-200 rounded-full">
                      <OrgRuleGroupIcon
                        groupKey={group.key}
                        className="w-4 h-4 text-warning-600"
                      />
                      <span className="text-xs font-medium text-default-700">
                        {group.label}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-default-200"></div>
                  </div>

                  <ul className="space-y-4">
                    {groupRules.map(
                      ({ ruleKey: _ruleKey, ruleMetadata, score }, ruleIdx) => (
                        <li
                          key={ruleIdx}
                          className={`pb-3 border-b border-default-200 ${
                            ruleMetadata.priority === "high"
                              ? "bg-warning-50 border-warning-200 rounded-lg p-3 -mx-3"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between text-sm font-medium text-default-900">
                            <div className="flex items-center gap-2">
                              {ruleMetadata.label}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-warning-600 font-semibold">
                                +{score}
                              </span>
                            </div>
                          </div>

                          <ul className="mt-1 space-y-1">
                            {ruleMetadata.requirements.map(
                              (requirement, reqIdx) => (
                                <li
                                  key={reqIdx}
                                  className="text-sm text-default-700 leading-snug"
                                >
                                  {typeof requirement === "string" ? (
                                    <div className="flex items-start gap-2">
                                      <span className="mt-0.5">✓</span>
                                      <span>{requirement}</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="flex items-start gap-2">
                                        <span className="mt-0.5">✓</span>
                                        <span className="font-medium">
                                          {requirement.label}
                                        </span>
                                      </div>
                                      {requirement.description && (
                                        <div className="pl-6 text-xs italic">
                                          {requirement.description}
                                        </div>
                                      )}
                                      <ul className="pl-6 space-y-1">
                                        {requirement.items.map(
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

                          {ruleMetadata.includedInPlan.length > 0 && (
                            <div className="mt-2">
                              <Link
                                href={`/pricing?org=${orgInstance.org.username}`}
                              >
                                <Chip
                                  size="sm"
                                  variant="light"
                                  color="secondary"
                                  className="text-xs font-medium gap-1"
                                  startContent={
                                    <WrenchIcon className="w-3 h-3 text-secondary-700" />
                                  }
                                >
                                  {(() => {
                                    const messages = [
                                      "Need help setting this up? We got you.",
                                      "No time? Sovoli will handle it.",
                                      "Not sure where to start? We'll guide you.",
                                      "Don't have this? We can help!",
                                      "Wah dis? Mek wi help yuh!",
                                    ];
                                    return messages[
                                      Math.floor(
                                        Math.random() * messages.length,
                                      )
                                    ];
                                  })()}
                                </Chip>
                              </Link>
                            </div>
                          )}

                          {ruleMetadata.priority === "high" && (
                            <div className="mt-2 p-2 bg-warning-100 border border-warning-200 rounded-md">
                              <p className="text-xs text-warning-800 font-medium flex items-center gap-1">
                                <AlertTriangleIcon className="w-3 h-3" />
                                Priority
                              </p>
                              <p className="text-xs text-warning-700 mt-1">
                                {ruleMetadata.priorityReason}
                              </p>
                            </div>
                          )}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-3 mt-3">
              <Button
                as={WhatsAppLink}
                message={`Hello, I'm interested in submitting missing info for ${orgInstance.org.username}`}
                size="sm"
                variant="light"
                className="text-default-600 underline underline-offset-4"
                intent="Submit Missing Info"
                userRole="admin"
                page="scores"
                orgId={orgInstance.org.username}
                orgName={orgInstance.org.username}
                funnel="admin_scores"
              >
                Submit Missing Info
              </Button>

              {incompleteRules.some(
                ({ ruleMetadata }) => ruleMetadata.includedInPlan.length > 0,
              ) && (
                <div className="flex flex-col items-center gap-3 pt-4 border-t border-default-200 w-full">
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary-600">
                    <div className="p-1 bg-secondary-100 rounded-full shadow-xs border border-secondary-300">
                      <WrenchIcon className="w-4 h-4 text-secondary-700" />
                    </div>
                    Total score boost:{" "}
                    <span className="font-bold">+{totalScoreBoost}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="shadow"
                    color="secondary"
                    as={Link}
                    href={`/pricing?org=${orgInstance.org.username}`}
                    className="rounded-md px-4 py-1.5 font-semibold text-sm"
                    endContent={<RocketIcon className="w-4 h-4" />}
                  >
                    View Growth Plan
                  </Button>

                  <p className="text-xs text-default-500 text-center leading-snug px-4">
                    These missing pieces are holding you back.
                    <br />
                    <span className="text-secondary-500 font-medium">
                      Let us build them — and bring families directly to your
                      school.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {showDetails && incompleteRules.length > 5 && (
          <div className="flex justify-between items-center mt-3">
            <Button
              size="sm"
              variant="light"
              color="warning"
              className="flex items-center gap-1 p-0 bg-transparent"
              disableRipple
              onPress={() => setShowDetails(false)}
              endContent={<ChevronUpIcon className="w-4 h-4" />}
            >
              Hide
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
}
