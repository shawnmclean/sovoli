import type { RuleKey } from "../scoring/rules";

export type PlanKey = "lead-gen" | "enrollment" | "sis";

export interface PlanDefinition {
  key: PlanKey;
  title: string;
  subtitle: string;
  description: string;
  includedRules: RuleKey[];
  includedFeatures: string[]; // optional, like "school website", "parent portal", etc.
  pricing?: {
    monthly: number;
    yearly: number;
  };
  isDefault?: boolean; // If one plan is auto-assigned
}
