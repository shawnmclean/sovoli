"use client";

import React, { useState } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  WrenchIcon,
  ClipboardListIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
} from "lucide-react";

import type { RuleScoreMap, RuleSet } from "../types";
import type { RuleKey } from "../rules";
import { pluralize } from "~/utils/pluralize";
import { Chip } from "@sovoli/ui/components/chip";
import { Tooltip } from "@sovoli/ui/components/tooltip";

export interface RulesAttentionSummaryProps {
  rulesScore: RuleScoreMap;
  ruleSet: RuleSet;
}

export function RulesAttentionSummary({
  rulesScore,
  ruleSet,
}: RulesAttentionSummaryProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (Object.keys(rulesScore).length === 0) return null;

  const incompleteRules = Object.entries(rulesScore)
    .map(([ruleKey]) => {
      const typedRuleKey = ruleKey as RuleKey;
      const ruleMetadata = ruleSet.ruleMetadata[typedRuleKey];
      if (!ruleMetadata) return null;

      return {
        ruleKey: typedRuleKey,
        ruleMetadata,
        score: rulesScore[typedRuleKey]?.maxScore ?? 0,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const incompleteRulesCount = incompleteRules.length;
  const incompleteCoveredByPlanRules = incompleteRules.filter(
    ({ ruleMetadata }) => ruleMetadata.includedInPlan.length > 0,
  );
  const incompleteCoveredByPlanRulesCount = incompleteCoveredByPlanRules.length;

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
          <div className="mt-4">
            <ul className="space-y-4">
              {incompleteRules.map(
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
                        {ruleMetadata.includedInPlan.length > 0 && (
                          <Tooltip content="Sovoli can help you with this.">
                            <WrenchIcon className="w-3.5 h-3.5 text-warning-600" />
                          </Tooltip>
                        )}
                        <span className="text-xs text-warning-600 font-semibold">
                          +{score}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-1 space-y-1">
                      {ruleMetadata.requirements.map((requirement, reqIdx) => (
                        <li
                          key={reqIdx}
                          className="text-sm text-default-700 leading-snug"
                        >
                          • {requirement}
                        </li>
                      ))}
                    </ul>

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

            <div className="flex flex-col items-center gap-3 mt-3">
              <Button
                size="sm"
                variant="light"
                className="text-default-600 underline underline-offset-4"
              >
                Submit Missing Info
              </Button>

              {incompleteRules.some(
                ({ ruleMetadata }) => ruleMetadata.includedInPlan.length > 0,
              ) && (
                <div className="flex flex-col items-center gap-2 pt-2 border-t border-default-200 w-full">
                  <div className="text-sm font-medium text-warning-600 flex items-center gap-1">
                    <WrenchIcon className="text-warning-600" />
                    Total score boost: +{totalScoreBoost}
                  </div>
                  <Button
                    size="sm"
                    variant="shadow"
                    color="warning"
                    as={Link}
                    href="/pricing"
                  >
                    View Pricing
                  </Button>

                  <p className="text-xs text-default-500 text-center flex gap-1">
                    Don't have these {incompleteCoveredByPlanRulesCount}{" "}
                    {pluralize(incompleteCoveredByPlanRulesCount, "item")}? We
                    can help with these items if your school doesn't have them
                    yet.
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
