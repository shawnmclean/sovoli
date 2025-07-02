import type { AmountByCurrency } from "../core/types";
import type { RuleKey } from "../scoring/rules";

export type PlanKey = "lead-gen" | "enrollment" | "sis";

export interface PlanDefinition {
  key: PlanKey;
  title: string;
  subtitle?: string;
  description?: string;

  onboardingNode?: string;

  offers: Partial<
    Record<
      string,
      {
        label: string;
        pitch?: string;
        ctaLabel?: string;
        covers: RuleKey[];
        optional?: {
          pricing: AmountByCurrency;
          description?: string;
        };
      }
    >
  >;

  pricing?: {
    oneTime: AmountByCurrency; // Mandatory setup cost
    yearly: AmountByCurrency; // Recurring annual fee
    note?: string;
  };
  discount?: {
    percentage: number;
    message?: string;
  };
}
