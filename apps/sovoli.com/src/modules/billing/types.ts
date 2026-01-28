import type {
  AmountByCurrency,
  CurrencyCode,
} from "~/modules/core/economics/types";
import type { PlanKey } from "~/modules/plans/types";

export type SubscriptionCadence = "monthly" | "annual";

export type BillingInvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "void"
  | "uncollectible"
  | "refunded";

export type BillingPaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded";

export type BillingPaymentMethod =
  | "cash"
  | "bank_transfer"
  | "card"
  | "mobile_money"
  | "paypal"
  | "other";

export type BillingSubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export type InvoiceLineItemType =
  | "subscription"
  | "usage"
  | "one_time"
  | "adjustment";

export interface ProrationInfo {
  /**
   * Total days in the full billing period.
   */
  fullPeriodDays: number;
  /**
   * Number of days used/billed in this period.
   */
  usedDays: number;
  /**
   * Proration factor (usedDays / fullPeriodDays).
   */
  factor: number;
}

export interface LineItemSource {
  /**
   * Subscription ID that generated this line item.
   */
  subscriptionId?: string;
  /**
   * Plan ID that generated this line item.
   */
  planId?: string;
  /**
   * Add-on ID that generated this line item.
   */
  addonId?: string;
}

export interface BillingAddOnSelection {
  /**
   * Pricing item ID from the selected plan definition.
   * Example: "additional-programs-monthly"
   */
  pricingItemId: string;
  quantity?: number;
}

export interface BillingInvoiceLineItem {
  pricingItemId: string;
  label?: string;
  description?: string;
  quantity?: number;
  /**
   * Type of line item (subscription, usage, one-time, adjustment).
   */
  type?: InvoiceLineItemType;
  /**
   * Billing period start (ISO timestamp).
   * Required for subscription/usage line items.
   */
  periodStart?: string;
  /**
   * Billing period end (ISO timestamp, exclusive).
   * Required for subscription/usage line items.
   */
  periodEnd?: string;
  /**
   * Source information (subscription_id, plan_id, addon_id).
   */
  source?: LineItemSource;
  /**
   * Proration information if this line item is prorated.
   */
  proration?: ProrationInfo;
  /**
   * Snapshot amounts at invoice time (optional).
   * If omitted, UI can derive from plan pricing items.
   */
  unitAmount?: AmountByCurrency;
  lineAmount?: AmountByCurrency;
}

export interface BillingInvoice {
  id: string;
  status: BillingInvoiceStatus;

  /**
   * Human-friendly invoice number (e.g., "INV-2026-001").
   * Assigned manually or by invoice generation system.
   */
  invoiceNumber?: string;

  /**
   * ISO timestamps.
   * `issuedAt` is when the invoice is created/issued to the customer.
   */
  issuedAt: string;
  dueAt?: string;
  paidAt?: string;
  voidedAt?: string;

  /**
   * Billing period start (ISO timestamp).
   * Derived as min(lineItems.periodStart) if not explicitly set.
   */
  periodStart?: string;
  /**
   * Billing period end (ISO timestamp, exclusive).
   * Derived as max(lineItems.periodEnd) if not explicitly set.
   */
  periodEnd?: string;

  currency?: CurrencyCode;

  /**
   * Plan and cadence snapshot (optional).
   * Useful if a tenant changes plan later.
   */
  planKey?: PlanKey;
  cadence?: SubscriptionCadence;

  lineItems?: BillingInvoiceLineItem[];

  /**
   * Totals (snapshotted).
   * If omitted, UI can compute from `lineItems`.
   */
  subtotal?: AmountByCurrency;
  discountTotal?: AmountByCurrency;
  taxTotal?: AmountByCurrency;
  total: AmountByCurrency;

  /**
   * Payments applied to this invoice.
   * Preferred over the module-level `payments[]` list for display.
   */
  payments?: BillingPayment[];

  notes?: string;
}

export interface BillingPayment {
  id: string;
  status: BillingPaymentStatus;
  method: BillingPaymentMethod;
  /**
   * Payment timestamp (ISO).
   * For pending payments, this can be the date payment was initiated/recorded.
   */
  paidAt: string;

  /**
   * Optional linkage to an invoice.
   */
  invoiceId?: string;

  currency?: CurrencyCode;
  amount: AmountByCurrency;

  /**
   * Payment processor (e.g., "stripe", "bank_transfer", "cash", "manual").
   */
  processor?: string;
  /**
   * Transaction reference from processor (e.g., payment intent ID, bank transfer ref).
   */
  transactionReference?: string;

  reference?: string; // e.g. bank transfer ref, receipt number (legacy, prefer transactionReference)
  notes?: string;
}

export interface BillingSubscription {
  /**
   * Ties the subscription to a plan definition.
   * Example: "growth"
   */
  planKey?: PlanKey;

  cadence: SubscriptionCadence;

  status?: BillingSubscriptionStatus;

  /**
   * Selected plan add-ons / quantities (by PricingItem.id).
   * Example: additional programs quantity.
   */
  addOns?: BillingAddOnSelection[];

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
  invoices?: BillingInvoice[];
  payments?: BillingPayment[];
  notes?: string;
}
