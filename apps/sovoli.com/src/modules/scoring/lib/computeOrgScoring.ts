import type { OrgInstance } from "~/modules/organisations/types";
import { categoryRuleSets } from "../ruleSets";
import type { RuleKey } from "../rules";
import { rules } from "../rules";
import type {
  GroupScore,
  OrgCategoryRuleSet,
  RuleScoreMap,
  ScoredRule,
  ScoreSummary,
  ScoringModule,
} from "../types";

function computeSummary(
  ruleScores: RuleScoreMap,
  categoryRuleSets: OrgCategoryRuleSet,
): ScoreSummary {
  let totalScore = 0;
  let totalMaxScore = 0;
  const allGroupScores: Record<string, GroupScore> = {};

  // Calculate scores for each category rule set
  Object.entries(categoryRuleSets).forEach(([_category, ruleSet]) => {
    // Calculate group scores within the category
    ruleSet.groups.forEach((group) => {
      let groupScore = 0;
      let groupMaxScore = 0;

      // Calculate scores for rules in this group
      group.rules.forEach((ruleKey) => {
        const scoredRule = ruleScores[ruleKey];
        if (scoredRule) {
          groupScore += scoredRule.score;
          groupMaxScore += scoredRule.maxScore;
        }
      });

      // Apply group weight
      const weightedGroupScore = groupScore * group.weight;
      const weightedGroupMaxScore = groupMaxScore * group.weight;

      allGroupScores[group.key] = {
        groupKey: group.key,
        score: weightedGroupScore,
        maxScore: weightedGroupMaxScore,
      };

      // Add to overall totals
      totalScore += weightedGroupScore;
      totalMaxScore += weightedGroupMaxScore;
    });
  });

  const scoreSummary: ScoreSummary = {
    totalScore,
    maxScore: totalMaxScore,
    groupScores: allGroupScores,
  };

  return scoreSummary;
}

export async function computeOrgScoring(
  orgInstance: OrgInstance,
): Promise<ScoringModule> {
  const { org } = orgInstance;

  // 1. Gather applicable category rule sets
  const orgCategoryRuleSets: OrgCategoryRuleSet = Object.fromEntries(
    org.categories
      .filter((cat) => categoryRuleSets[cat]) // Only include categories that have rule sets
      .map((cat) => [cat, categoryRuleSets[cat]]),
  );

  // 2. Gather all unique rule keys from all applicable rule sets
  const categoryRuleKeys = Object.values(orgCategoryRuleSets).flatMap((rs) =>
    rs.groups.flatMap((g) => g.rules),
  );

  const uniqueRuleKeys = Array.from(new Set([...categoryRuleKeys]));

  // 3. Compute rule scores
  const ruleScores: Partial<Record<RuleKey, ScoredRule>> = {};
  await Promise.all(
    uniqueRuleKeys.map(async (key) => {
      const rule = rules[key];

      const result = await rule.compute(orgInstance);
      ruleScores[key] = {
        score: result.score,
        maxScore: rule.maxScore,
        note: result.note,
      };
    }),
  );

  const scoreSummary = computeSummary(ruleScores, orgCategoryRuleSets);

  return {
    result: {
      ruleScores,
      scoreSummary,
    },
  };
}
