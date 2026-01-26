export type SubscriptionCadence = "monthly" | "annual";

export interface BillingSubscription {
  cadence: SubscriptionCadence;

  /**
   * Explicit override for paid status.
   * If omitted, paid status can be derived from `paidThrough` compared to today.
   */
  isPaid?: boolean;

  /** ISO string for last payment date/time */
  lastPaidAt?: string;
  /** ISO string for the date the subscription is paid through */
  paidThrough?: string;
  /** ISO string for the next billing date */
  nextBillAt?: string;
}

export interface BillingModule {
  subscription: BillingSubscription;
  notes?: string;
}

