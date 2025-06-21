import type { OrgScoreRule } from "../types";

export function getRule(
  rules: Record<string, OrgScoreRule>,
  key: string,
): OrgScoreRule {
  const rule = rules[key];
  if (!rule) throw new Error(`Missing shared rule: ${key}`);
  return rule;
}
