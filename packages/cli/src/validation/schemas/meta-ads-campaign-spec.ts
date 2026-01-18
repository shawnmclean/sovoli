import { z } from "zod";

export const metaAdsObjectiveSchema = z.enum([
  "OUTCOME_AWARENESS",
  "OUTCOME_TRAFFIC",
  "OUTCOME_ENGAGEMENT",
  "OUTCOME_LEADS",
  "OUTCOME_SALES",
  "OUTCOME_APP_PROMOTION",
]);

export const metaAdsBudgetSchema = z
  .object({
    dailyBudget: z.number().int().positive().optional(),
    lifetimeBudget: z.number().int().positive().optional(),
  })
  .refine((b) => !(b.dailyBudget && b.lifetimeBudget), {
    message: "Specify only one of dailyBudget or lifetimeBudget",
  });

export const metaAdsCreativeSpecSchema = z.object({
  /**
   * Creative name for Meta ad account library (optional).
   */
  name: z.string().min(1).optional(),

  /**
   * Facebook Page ID that owns the creative.
   */
  pageId: z.string().min(1),

  /**
   * Program page URL (destination link).
   */
  linkUrl: z.string().url(),

  /**
   * Primary text shown above the image.
   */
  message: z.string().min(1),

  /**
   * Headline text (Meta calls this link_data.name).
   */
  headline: z.string().min(1),

  /**
   * Optional description/subheadline.
   */
  description: z.string().min(1).optional(),

  /**
   * Local file path (repo-relative by default) to the creative image.
   */
  imagePath: z.string().min(1),

  /**
   * CTA type (defaults to LEARN_MORE).
   */
  callToActionType: z.string().min(1).optional(),
});

export const metaAdsAdSpecSchema = z.object({
  name: z.string().min(1),
  adSetRef: z.string().min(1),
  creative: metaAdsCreativeSpecSchema,
});

export const metaAdsAdSetSpecSchema = z.object({
  /**
   * Stable reference name used by ads[].adSetRef (not sent to Meta).
   */
  ref: z.string().min(1),

  name: z.string().min(1),
  optimizationGoal: z.string().min(1),
  billingEvent: z.string().min(1),
  /**
   * Optional bid amount in minor currency units (e.g., cents for USD).
   * Some accounts default to bid-cap/target-cost strategies that require this.
   */
  bidAmount: z.number().int().positive().optional(),

  /**
   * Targeting payload passed through to Meta API.
   * Keep this flexible so the web generator can evolve.
   */
  targeting: z.record(z.string(), z.unknown()),

  /**
   * Optional ad set budget. If omitted, campaign-level budget must be provided.
   */
  budget: metaAdsBudgetSchema.optional(),

  startTime: z.string().min(1).optional(),
  endTime: z.string().min(1).optional(),
});

export const metaAdsCampaignSpecSchema = z.object({
  schemaVersion: z.literal(1),
  meta: z.object({
    apiVersion: z.string().min(1).default("v24.0"),
    adAccountId: z.string().min(1),
    /**
     * Environment variable name that holds the system user token.
     * This keeps tokens out of the generated JSON file.
     */
    systemUserTokenEnv: z.string().min(1),
  }),
  campaign: z.object({
    name: z.string().min(1),
    objective: metaAdsObjectiveSchema,
    specialAdCategories: z.array(z.string().min(1)).optional(),
    buyingType: z.string().min(1).optional(),
    budget: metaAdsBudgetSchema.optional(),
  }),
  adSets: z.array(metaAdsAdSetSpecSchema).min(1),
  ads: z.array(metaAdsAdSpecSchema).min(1),
});

export type MetaAdsCampaignSpec = z.infer<typeof metaAdsCampaignSpecSchema>;
