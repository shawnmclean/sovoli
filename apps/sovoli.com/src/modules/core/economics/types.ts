export type CurrencyCode = "GYD" | "USD" | "JMD";
export type AmountByCurrency = Partial<Record<CurrencyCode, number>>;

export type BillingCycle = "one-time" | "annual" | "term" | "program";
export type PricingItemPurpose = "registration" | "tuition" | "materials";

export interface Discount {
  id: string;
  label?: string; // e.g., "Early Bird"
  message?: string; // UI message: "20% off until Aug 1"
  type: "percentage" | "fixed";
  value: number;
  currency?: keyof AmountByCurrency; // Required only for fixed type
  validFrom?: string; // ISO date
  validUntil: string;
  appliesTo: string[]; // list of PricingItem ids or keys
  isActive?: boolean;
}

export interface PricingItem {
  id: string; // e.g., "setup", "annual-maintenance", "optional-logo"
  label: string; // UI label
  description?: string;
  billingCycle: BillingCycle;
  amount: AmountByCurrency;
  purpose?: PricingItemPurpose;
  optional?: boolean;
  notes?: string;
  /**
   * If true, this item should be displayed with increment/decrement controls
   * instead of a checkbox. The amount represents the price per unit.
   */
  isQuantityBased?: boolean;
}

export type DueAt =
  | { type: "now" }
  | { type: "date"; date: string } // ISO date
  | {
      type: "after_start";
      count: number;
      unit: "day" | "week" | "month" | "year";
    };

export interface PaymentSplit {
  id: string;
  pricingItemId: string;
  percentage: number;
  dueAt: DueAt;
  note?: string;
}

export interface PricingPackage {
  pricingItems: PricingItem[];
  discounts?: Discount[];
  paymentSplits?: PaymentSplit[];
  notes?: string;
}
