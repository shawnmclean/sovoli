import type { RuleKey } from "~/modules/scoring/rules";
import type { PricingPackage } from "~/modules/core/economics/types";

export type PlanKey = "growth" | "enrollment" | "sis";

export interface PlanFeature {
  label: string;
  pitch?: string;
  ctaLabel?: string;
  covers: RuleKey[];
}

export interface PlanDefinition {
  key: PlanKey;
  title: string;
  subtitle?: string;
  description?: string;
  onboardingNode?: string;

  /**
   * Core feature descriptions, separate from pricing logic.
   * Keyed by string (e.g., "googleProfile", "email", etc.)
   */
  features: Record<string, PlanFeature>;

  pricingPackage: PricingPackage;
}
