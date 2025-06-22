import type { OrgInstance } from "../organisations/types";
import type { RuleKey } from "./rules";

export interface ScoringModule {
  result: OrgScoringResult;
}

export interface OrgScoringResult {
  categories: Record<string, OrgCategoryScore>;
  totalScore: number; // sum of all category-weighted scores
  maxScore: number;
}

export interface OrgCategoryScore {
  category: string; // e.g., "private-school"
  totalScore: number;
  maxScore: number;
  groups: Record<string, ScoredGroup>; // e.g., "trust", "communication"
}

export interface ScoredGroup {
  key: string;
  label: string;
  icon: string;
  score: number;
  maxScore: number;
  weight: number;
  breakdown: Record<string, ScoredRule>; // ruleKey → score + note
}

export interface ScoredRule {
  label: string;
  score: number;
  maxScore: number;
  note?: string;
}

// -- Internal Scoring Systems --

export interface ScoringResult {
  score: number;
  note?: string;
}

export type OrgScoreComputeFn = (ctx: OrgInstance) => Promise<ScoringResult>;
export interface OrgScoreRule {
  key: string;
  label: string;
  maxScore: number;
  compute: OrgScoreComputeFn;

  adminDescription?: string | string[];
  consumerDescription?: string | string[];
}

export interface OrgRuleGroup {
  key: string;
  label: string;

  weight: number;
  rules: RuleKey[];

  adminDescription?: string | string[];
  consumerDescription?: string | string[];
}

export interface CategoryRuleSet {
  category: string; // e.g. "private-school"
  groups: OrgRuleGroup[];
}
