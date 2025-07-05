export type CurrencyCode = "GYD" | "USD";
export type AmountByCurrency = Partial<Record<CurrencyCode, number>>;

export type BillingCycle = "one-time" | "annual" | "term";
export type PricingItemPurpose = "registration" | "tuition";

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
}

export interface PricingPackage {
  pricingItems: PricingItem[];
  discounts?: Discount[];
  notes?: string;
}
