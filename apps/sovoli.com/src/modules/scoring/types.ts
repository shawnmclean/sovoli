import type { OrgCategoryKeys, OrgInstance } from "../organisations/types";
import type { PlanKey } from "../plans/types";
import type { RuleKey } from "./rules";

export interface ScoringModule {
  result: OrgScoringResult;
}

export type RuleScoreMap = Partial<Record<RuleKey, ScoredRule>>;

export interface OrgScoringResult {
  ruleScores: RuleScoreMap;
  scoreSummary: ScoreSummary;
}

export interface ScoredRule {
  score: number;
  maxScore: number;
  note?: string;
}

export interface ScoreSummary {
  totalScore: number;
  maxScore: number;
  groupScores: Record<string, GroupScore>;
}

export interface GroupScore {
  groupKey: string;
  score: number;
  maxScore: number;
}

// #region -- Internal logic-only rule execution --

export type OrgScoreComputeFn = (ctx: OrgInstance) => Promise<ScoringResult>;

export interface OrgScoreRule {
  key: string;
  maxScore: number;
  compute: OrgScoreComputeFn;
}

// Scoring result returned by the compute engine per rule
export interface ScoringResult {
  score: number;
  note?: string;
}

// #endregion

// #region -- Rule presentation --

export interface RuleMetadata {
  key: RuleKey;
  label: string;
  description: string;

  // Operational logic
  reasons: string[]; // Why this rule matters (for trust, operations, etc.)
  actions: string[]; // What the admin needs to do
  requirements: (
    | string
    | {
        label: string;
        description?: string;
        items: string[];
      }
  )[];
  effort: "low" | "medium" | "high";
  priority?: "low" | "medium" | "high";
  priorityReason?: string;
  learnMoreUrl?: string;

  // Sovoli package linkage
  includedInPlan: PlanKey[];
}

// #endregion

export interface OrgRuleGroup {
  key: string;
  label: string;
  weight: number;
  rules: RuleKey[];
  description: string;
  reasons: string[];
}

export type OrgCategoryRuleSet = Partial<Record<OrgCategoryKeys, RuleSet>>;
export interface RuleSet {
  groups: OrgRuleGroup[];
  ruleMetadata: Partial<Record<RuleKey, RuleMetadata>>;
}
