import { z } from "zod";

import type { BillingModule } from "~/modules/billing/types";

const currencyCodeSchema = z.enum(["USD", "GYD", "JMD"]);

const amountByCurrencySchema = z.object({
  USD: z.number().optional(),
  GYD: z.number().optional(),
  JMD: z.number().optional(),
});

const planKeySchema = z.enum(["growth", "enrollment", "sis"]);

const subscriptionCadenceSchema = z.enum(["monthly", "annual"]);

const prorationInfoSchema = z.object({
  fullPeriodDays: z.number(),
  usedDays: z.number(),
  factor: z.number(),
});

const lineItemSourceSchema = z.object({
  subscriptionId: z.string().optional(),
  planId: z.string().optional(),
  addonId: z.string().optional(),
});

const invoiceLineItemSchema = z.object({
  pricingItemId: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().optional(),
  type: z.enum(["subscription", "usage", "one_time", "adjustment"]).optional(),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
  source: lineItemSourceSchema.optional(),
  proration: prorationInfoSchema.optional(),
  unitAmount: amountByCurrencySchema.optional(),
  lineAmount: amountByCurrencySchema.optional(),
});

const paymentSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "succeeded", "failed", "refunded"]),
  method: z.enum([
    "cash",
    "bank_transfer",
    "card",
    "mobile_money",
    "paypal",
    "other",
  ]),
  paidAt: z.string(),
  invoiceId: z.string().optional(),
  currency: currencyCodeSchema.optional(),
  amount: amountByCurrencySchema,
  processor: z.string().optional(),
  transactionReference: z.string().optional(),
  reference: z.string().optional(), // Legacy field, prefer transactionReference
  notes: z.string().optional(),
});

const invoiceSchema = z.object({
  id: z.string(),
  status: z.enum([
    "draft",
    "open",
    "paid",
    "void",
    "uncollectible",
    "refunded",
  ]),
  invoiceNumber: z.string().optional(),
  issuedAt: z.string(),
  dueAt: z.string().optional(),
  paidAt: z.string().optional(),
  voidedAt: z.string().optional(),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),

  currency: currencyCodeSchema.optional(),
  planKey: planKeySchema.optional(),
  cadence: subscriptionCadenceSchema.optional(),

  lineItems: z.array(invoiceLineItemSchema).optional(),

  subtotal: amountByCurrencySchema.optional(),
  discountTotal: amountByCurrencySchema.optional(),
  taxTotal: amountByCurrencySchema.optional(),
  total: amountByCurrencySchema,

  payments: z.array(paymentSchema).optional(),
  notes: z.string().optional(),
});

const addOnSelectionSchema = z.object({
  pricingItemId: z.string(),
  quantity: z.number().optional(),
});

const billingModuleJsonSchema = z.object({
  subscription: z.object({
    planKey: planKeySchema.optional(),
    cadence: subscriptionCadenceSchema,
    status: z
      .enum(["trialing", "active", "past_due", "canceled", "unpaid"])
      .optional(),
    addOns: z.array(addOnSelectionSchema).optional(),
    isPaid: z.boolean().optional(),
    lastPaidAt: z.string().optional(),
    paidThrough: z.string().optional(),
    nextBillAt: z.string().optional(),
  }),
  invoices: z.array(invoiceSchema).optional(),
  payments: z.array(paymentSchema).optional(),
  notes: z.string().optional(),
});

export function parseBillingModule(jsonData: unknown): BillingModule {
  return billingModuleJsonSchema.parse(jsonData) as BillingModule;
}
