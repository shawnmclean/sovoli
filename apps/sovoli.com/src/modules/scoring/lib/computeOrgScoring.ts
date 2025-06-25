import type {
  ScoringModule,
  ScoredRule,
  ScoreSummary,
  RuleScoreMap,
  OrgCategoryRuleSet,
  CategoryScoreMap,
  GroupScore,
} from "../types";
import type { OrgInstance } from "~/modules/organisations/types";
import { categoryRuleSets, coreRuleSet } from "../ruleSets";
import { rules } from "../rules";
import type { RuleKey } from "../rules";

function computeSummaries(
  ruleScores: RuleScoreMap,
  categoryRuleSets: OrgCategoryRuleSet,
): {
  categorySummaryScores: CategoryScoreMap;
  scoreSummary: ScoreSummary;
} {
  const categorySummaryScores: CategoryScoreMap = {};
  let totalScore = 0;
  let totalMaxScore = 0;
  const allGroupScores: Record<string, GroupScore> = {};

  // Calculate scores for each category
  Object.entries(categoryRuleSets).forEach(([category, ruleSet]) => {
    let categoryScore = 0;
    let categoryMaxScore = 0;
    const categoryGroupScores: Record<string, GroupScore> = {};

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

      categoryGroupScores[group.key] = {
        groupKey: group.key,
        score: weightedGroupScore,
        maxScore: weightedGroupMaxScore,
      };

      categoryScore += weightedGroupScore;
      categoryMaxScore += weightedGroupMaxScore;
    });

    // Store category summary
    categorySummaryScores[category as keyof typeof categorySummaryScores] = {
      totalScore: categoryScore,
      maxScore: categoryMaxScore,
      groupScores: categoryGroupScores,
    };

    // Add to overall totals
    totalScore += categoryScore;
    totalMaxScore += categoryMaxScore;

    // Add category group scores to overall group scores
    Object.assign(allGroupScores, categoryGroupScores);
  });

  // Calculate core rule scores (not tied to any specific category)
  let coreScore = 0;
  let coreMaxScore = 0;
  const coreGroupScores: Record<string, GroupScore> = {};

  coreRuleSet.groups.forEach((group) => {
    let groupScore = 0;
    let groupMaxScore = 0;

    group.rules.forEach((ruleKey) => {
      const scoredRule = ruleScores[ruleKey];
      if (scoredRule) {
        groupScore += scoredRule.score;
        groupMaxScore += scoredRule.maxScore;
      }
    });

    const weightedGroupScore = groupScore * group.weight;
    const weightedGroupMaxScore = groupMaxScore * group.weight;

    coreGroupScores[group.key] = {
      groupKey: group.key,
      score: weightedGroupScore,
      maxScore: weightedGroupMaxScore,
    };

    coreScore += weightedGroupScore;
    coreMaxScore += weightedGroupMaxScore;
  });

  // Add core scores to overall totals
  totalScore += coreScore;
  totalMaxScore += coreMaxScore;
  Object.assign(allGroupScores, coreGroupScores);

  const scoreSummary: ScoreSummary = {
    totalScore,
    maxScore: totalMaxScore,
    groupScores: allGroupScores,
  };

  return {
    categorySummaryScores,
    scoreSummary,
  };
}

export async function computeOrgScoring(
  orgInstance: OrgInstance,
): Promise<ScoringModule> {
  const { org } = orgInstance;

  // 1. Gather applicable category rule sets
  const orgCategoryRuleSets: OrgCategoryRuleSet = Object.fromEntries(
    org.categories.map((cat) => [cat, categoryRuleSets[cat]]),
  );

  // 2. Gather all unique rule keys (category)
  const categoryRuleKeys = Object.values(orgCategoryRuleSets).flatMap((rs) =>
    rs.groups.flatMap((g) => g.rules),
  );

  const coreRuleKeys = coreRuleSet.groups.flatMap((g) => g.rules);
  const uniqueRuleKeys = Array.from(
    new Set([...categoryRuleKeys, ...coreRuleKeys]),
  );

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

  const { categorySummaryScores, scoreSummary } = computeSummaries(
    ruleScores,
    orgCategoryRuleSets,
  );

  return {
    result: {
      ruleScores,
      scoreSummary,
      categorySummaryScores,
    },
  };
}
