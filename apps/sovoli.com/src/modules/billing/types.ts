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
   * ISO timestamps.
   * `issuedAt` is when the invoice is created/issued to the customer.
   */
  issuedAt: string;
  dueAt?: string;
  paidAt?: string;
  voidedAt?: string;

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

  reference?: string; // e.g. bank transfer ref, receipt number
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
