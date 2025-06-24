import type { RuleKey } from "../scoring/rules";

export type PlanKey = "lead-gen" | "enrollment" | "sis";
export type Currency = "GYD" | "USD";

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
          pricing: Record<Currency, number>;
          description?: string;
        };
      }
    >
  >;

  pricing?: {
    oneTime: Record<Currency, number>; // Mandatory setup cost
    yearly: Record<Currency, number>; // Recurring annual fee
    note?: string;
  };
  discount?: {
    oneTime: Record<Currency, number>;
    message?: string; // Optional display message
  };
}
