import type { OrgCategoryKeys, OrgInstance } from "../organisations/types";
import type { RuleKey } from "./rules";

export interface ScoringModule {
  result: OrgScoringResult;
}

export interface OrgScoringResult {
  ruleScores: Partial<Record<RuleKey, ScoredRule>>;
}

export interface ScoredRule {
  score: number;
  maxScore: number;
  note?: string;
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

export type ViewAudience =
  | "admin"
  | "parent"
  | "student"
  | "ngo"
  | "government";

export interface RulePresentation {
  key: RuleKey;
  defaultLabel: string;
  audienceViews?: Partial<Record<ViewAudience, AudienceMessage>>;
}

export interface AudienceMessage {
  label?: string;
  description?: string | string[];
  priority?: "low" | "medium" | "high";
  hidden?: boolean;
}

// #endregion
export interface OrgRuleGroup {
  key: string;
  label: string;
  weight: number;
  rules: RuleKey[];

  descriptions?: Partial<Record<ViewAudience, string | string[]>>;
  visibility?: Partial<Record<ViewAudience, boolean>>;
}

export interface CategoryRuleSet {
  category: OrgCategoryKeys;
  groups: OrgRuleGroup[];
  ruleMetadata: Partial<Record<RuleKey, RulePresentation>>;
}
