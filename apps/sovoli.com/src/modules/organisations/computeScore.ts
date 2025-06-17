import type {
  OrgInstance,
  ScoringModule,
  ScoringDimension,
  ScoringDimensionConfig,
} from "~/modules/organisations/types";

import { academicScoreConfig, digitalScoreConfig } from "./scoring";

function computeScoringDimension(
  config: ScoringDimensionConfig,
  instance: OrgInstance,
): ScoringDimension {
  const breakdown: ScoringDimension["breakdown"] = {};
  let total = 0;

  for (const rule of config.rules) {
    const score = rule.compute(instance);
    total += score;

    breakdown[rule.key] = {
      label: rule.label,
      score,
      maxScore: rule.maxScore,
      note: rule.note,
    };
  }

  const maxScore = config.rules.reduce((acc, rule) => acc + rule.maxScore, 0);

  return {
    score: total,
    maxScore,
    weight: config.weight,
    breakdown,
  };
}

export function computeOrgScore(instance: OrgInstance): ScoringModule {
  const digitalScore = computeScoringDimension(digitalScoreConfig, instance);
  const academicScore = computeScoringDimension(academicScoreConfig, instance);
  const totalScore = Math.round(
    (digitalScore.score / digitalScore.maxScore) * digitalScore.weight * 100,
  );

  return {
    totalScore,
    digitalScore,
    academicScore,
  };
}
