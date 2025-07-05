import type { RuleKey } from "~/modules/scoring/rules";
import type { PricingItem, Discount } from "~/modules/core/economics/types";

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

  /**
   * One or more pricing components for this plan.
   * All amounts, billing cycles, and discount rules are here.
   */
  pricingItems: PricingItem[];

  /**
   * Optional global discounts (e.g., 20% off the whole plan)
   * Use pricingItem-specific discounts inside PricingItem instead.
   */
  discounts?: Discount[];
}
