import type { PricingPackage } from "~/modules/core/economics/types";
import type { RuleKey } from "~/modules/scoring/rules";

export type PlanKey = "growth" | "enrollment" | "sis";

export interface PlanFeature {
  label: string;
  pitch?: string;
  ctaLabel?: string;
  covers: RuleKey[];
  /**
   * If false, this feature will not be displayed in the UI (default: true).
   * Useful for features that are mapped to other places but shouldn't appear in the "What's Included" section.
   */
  show?: boolean;
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
