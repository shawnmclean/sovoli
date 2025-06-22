import type { ScoringModule, ScoredRule } from "../types";
import type { OrgInstance } from "~/modules/organisations/types";
import { ruleSets } from "../ruleSets";
import { rules } from "../rules";
import type { RuleKey } from "../rules";

export async function computeOrgScoring(
  orgInstance: OrgInstance,
): Promise<ScoringModule> {
  const { org } = orgInstance;

  // 1. Collect all distinct rule keys across all applicable categories
  const ruleKeys = org.categories.flatMap((cat) => {
    const ruleSet = ruleSets[cat];
    if (!ruleSet) return [];

    return ruleSet.groups.flatMap((g) => g.rules);
  });

  // 2. Deduplicate keys
  const uniqueRuleKeys = Array.from(new Set(ruleKeys));

  // 3. Compute all rule scores
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

  return {
    result: {
      ruleScores,
    },
  };
}
