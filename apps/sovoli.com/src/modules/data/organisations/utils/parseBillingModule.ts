import { z } from "zod";
import type { BillingModule } from "~/modules/billing/types";

const billingModuleJsonSchema = z.object({
  subscription: z.object({
    cadence: z.enum(["monthly", "annual"]),
    isPaid: z.boolean().optional(),
    lastPaidAt: z.string().optional(),
    paidThrough: z.string().optional(),
    nextBillAt: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export function parseBillingModule(jsonData: unknown): BillingModule {
  return billingModuleJsonSchema.parse(jsonData) as BillingModule;
}

