import type { OrgInstance } from "../organisations/types";

export interface ScoringModule {
  totalScore: number;
  dimensions: Record<string, ScoringDimensionResult>;
}

export interface ScoringDimensionResult {
  score: number;
  maxScore: number;
  weight: number;
  breakdown: Record<
    string,
    {
      label: string;
      score: number;
      maxScore: number;
      note?: string;
    }
  >;
}

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
  note?: string;
}

export interface ScoringDimensionConfig {
  key: string; // e.g., "digitalScore"
  label: string; // Human-readable label
  weight: number; // Weight for totalScore
  rules: Record<string, OrgScoreRule>; // Keyed by rule key
}
