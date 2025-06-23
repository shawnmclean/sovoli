import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import {
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  ShieldIcon,
  UsersIcon,
  MessageCircleIcon,
} from "lucide-react";
import type { CategoryRuleSet, ScoringModule } from "../types";

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

export const ScoringBreakdown = ({
  scoringModule,
  ruleSet,
  audience = "admin",
}: ScoringBreakdownProps) => {
  const { result } = scoringModule;
  const { ruleScores, scoreSummary } = result;
  const { totalScore, maxScore, groupScores } = scoreSummary;
  const percentage =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Overall Score Section */}
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-default-900">
                Digital Readiness Score
              </h1>
              <p className="text-sm sm:text-base text-default-600 mt-1">
                How well this organization meets digital presence standards
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {totalScore}/{maxScore}
              </div>
              <div className="text-xs sm:text-sm text-default-500">
                {percentage}% Complete
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-4 sm:px-6 pt-0">
          {/* Progress Bar */}
          <div className="w-full bg-default-200 rounded-full h-2 sm:h-3 mb-4">
            <div
              className="bg-primary h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Score Summary by Groups */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {ruleSet.groups.map((group) => {
              const groupScore = groupScores[group.key];
              const groupPercentage =
                groupScore?.maxScore && groupScore.maxScore > 0
                  ? Math.round((groupScore.score / groupScore.maxScore) * 100)
                  : 0;
              const Icon = getGroupIcon(group.key);

              return (
                <div key={group.key} className="text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="text-sm sm:text-lg font-semibold">
                    {groupScore?.score ?? 0}/{groupScore?.maxScore ?? 0}
                  </div>
                  <div className="text-xs sm:text-sm text-default-500">
                    {group.label}
                  </div>
                  <div className="text-xs text-default-400">
                    {groupPercentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Detailed Groups */}
      <div className="space-y-4">
        {ruleSet.groups.map((group) => {
          const groupScore = groupScores[group.key];
          const groupPercentage =
            groupScore?.maxScore && groupScore.maxScore > 0
              ? Math.round((groupScore.score / groupScore.maxScore) * 100)
              : 0;
          const Icon = getGroupIcon(group.key);
          const groupDescription =
            group.descriptions?.[audience] ??
            group.descriptions?.admin ??
            "This group contains rules that contribute to your overall score.";

          return (
            <Card key={group.key} className="border-none shadow-md">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold truncate">
                      {group.label}
                    </h2>
                    <p className="text-xs sm:text-sm text-default-600">
                      {Array.isArray(groupDescription)
                        ? groupDescription.join(" ")
                        : groupDescription}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-semibold">
                      {groupScore?.score ?? 0}/{groupScore?.maxScore ?? 0}
                    </div>
                    <div className="text-xs text-default-500">
                      {groupPercentage}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-4 sm:px-6 pt-0">
                <div className="space-y-3">
                  {group.rules.map((ruleKey) => {
                    const scoredRule = ruleScores[ruleKey];
                    const ruleMetadata = ruleSet.ruleMetadata[ruleKey];
                    const audienceView =
                      ruleMetadata?.audienceViews?.[audience];

                    if (!ruleMetadata) return null;

                    const label =
                      audienceView?.label ?? ruleMetadata.defaultLabel;
                    const description =
                      audienceView?.description ??
                      (audience === "admin"
                        ? "This rule contributes to your overall score."
                        : "This helps evaluate the organization's digital presence.");

                    const achieved = scoredRule ? scoredRule.score > 0 : false;
                    const score = scoredRule?.score ?? 0;
                    const maxScore = scoredRule?.maxScore ?? 0;

                    return (
                      <div
                        key={ruleKey}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-default-50 rounded-lg gap-3"
                      >
                        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-0.5">
                            {achieved ? (
                              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                            ) : (
                              <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-default-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                              <span className="font-medium text-sm sm:text-base truncate">
                                {label}
                              </span>
                              {scoredRule?.note && (
                                <Chip size="sm" variant="flat" color="warning">
                                  {scoredRule.note}
                                </Chip>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-default-600">
                              {Array.isArray(description)
                                ? description.join(" ")
                                : description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                          <div className="text-right">
                            <div className="font-semibold text-sm sm:text-base">
                              {score}/{maxScore}
                            </div>
                            <div className="text-xs text-default-500">
                              {maxScore > 0
                                ? Math.round((score / maxScore) * 100)
                                : 0}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      <Card className="border-none shadow-md bg-warning-50">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
            <h2 className="text-lg sm:text-xl font-semibold">
              Recommendations
            </h2>
          </div>
        </CardHeader>
        <CardBody className="px-4 sm:px-6 pt-0">
          <div className="space-y-3">
            {ruleSet.groups
              .map((group) => {
                const groupScore = groupScores[group.key];
                const groupPercentage =
                  groupScore?.maxScore && groupScore.maxScore > 0
                    ? Math.round((groupScore.score / groupScore.maxScore) * 100)
                    : 0;

                // Only show recommendations for groups that are less than 100% complete
                if (groupPercentage >= 100) return null;

                return group.rules.map((ruleKey) => {
                  const scoredRule = ruleScores[ruleKey];
                  const ruleMetadata = ruleSet.ruleMetadata[ruleKey];
                  const audienceView = ruleMetadata?.audienceViews?.[audience];

                  if (!ruleMetadata || !scoredRule || scoredRule.score > 0)
                    return null;

                  const label =
                    audienceView?.label ?? ruleMetadata.defaultLabel;
                  const description =
                    audienceView?.description ??
                    "This would improve your overall score.";

                  return (
                    <div
                      key={ruleKey}
                      className="flex items-start gap-2 sm:gap-3"
                    >
                      <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-warning mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">
                          {label}
                        </p>
                        <p className="text-xs sm:text-sm text-default-600">
                          {Array.isArray(description)
                            ? description.join(" ")
                            : description}
                        </p>
                      </div>
                    </div>
                  );
                });
              })
              .flat()
              .filter(Boolean)}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
