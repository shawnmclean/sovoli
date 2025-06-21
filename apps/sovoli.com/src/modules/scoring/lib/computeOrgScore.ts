import type { ScoringModule, OrgScoreRule } from "../types";
import { privateSchoolRules } from "../categories/private-school/rules";
import type { OrgInstance } from "~/modules/organisations/types";

// Add more category rules here as needed
const categoryRuleMap: Record<string, Record<string, OrgScoreRule>> = {
  "private-school": privateSchoolRules,
};

export async function computeOrgScore(
  orgInstance: OrgInstance,
): Promise<ScoringModule> {
  const { org } = orgInstance;

  const seenKeys = new Set<string>();
  const breakdown: Record<string, ScoringModule["dimensions"]["dimensionKey"]> =
    {};

  let totalScore = 0;
  let totalMaxScore = 0;

  for (const category of org.categories) {
    const rules = categoryRuleMap[category];
    if (!rules) continue;

    for (const rule of Object.values(rules)) {
      if (seenKeys.has(rule.key)) continue;
      seenKeys.add(rule.key);

      const result = await rule.compute(orgInstance);

      const score = typeof result === "number" ? result : result.score;
      const note = typeof result === "number" ? undefined : result.note;

      breakdown[rule.key] = {
        label: rule.label,
        score,
        maxScore: rule.maxScore,
        note,
      };

      totalScore += score;
      totalMaxScore += rule.maxScore;
    }
  }

  return {
    totalScore,
    dimensions: {
      default: {
        score: totalScore,
        maxScore: totalMaxScore,
        weight: 1,
        breakdown,
      },
    },
  };
}
