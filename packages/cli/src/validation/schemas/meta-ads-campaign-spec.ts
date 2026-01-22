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

export const metaAdsCreativeFormatSchema = z.enum(["SINGLE_IMAGE", "CAROUSEL"]);

const metaAdsAssetCustomizationRuleSchema = z.object({
  /**
   * Local file path (repo-relative by default) to the creative image for this rule.
   */
  imagePath: z.string().min(1),

  /**
   * Meta "customization_spec" object used by asset_customization_rules.
   *
   * Keep flexible so we can pass through publisher_platforms / positions, etc.
   * Example:
   * {
   *   "publisher_platforms": ["instagram"],
   *   "instagram_positions": ["reels"]
   * }
   */
  customizationSpec: z.record(z.string(), z.unknown()),

  /**
   * Optional rule priority (lower is evaluated first).
   * If omitted, the CLI will assign incrementing priorities.
   */
  priority: z.number().int().positive().optional(),
});

const metaAdsCarouselCardSchema = z.object({
  imagePath: z.string().min(1),
  linkUrl: z.string().url().optional(),
  headline: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

const metaAdsCarouselSchema = z.object({
  /**
   * 2-10 carousel cards.
   */
  cards: z.array(metaAdsCarouselCardSchema).min(2).max(10),
  multiShareEndCard: z.boolean().optional(),
  multiShareOptimized: z.boolean().optional(),
});

export const metaAdsCreativeSpecSchema = z
  .object({
    /**
     * Creative name for Meta ad account library (optional).
     */
    name: z.string().min(1).optional(),

    /**
     * Facebook Page ID that owns the creative.
     */
    pageId: z.string().min(1),

    /**
     * Instagram user ID (optional, but recommended if you plan to run on Instagram placements).
     *
     * Note: Meta has moved from "actor" naming to "user" naming. Prefer instagramUserId.
     */
    instagramUserId: z.string().min(1).optional(),

    /**
     * Deprecated: use instagramUserId instead.
     * Kept for backwards compatibility with older spec files.
     */
    instagramActorId: z.string().min(1).optional(),

    /**
     * Program page URL (destination link).
     */
    linkUrl: z.string().url(),

    /**
     * Primary text shown above the image.
     */
    message: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),

    /**
     * Headline text (Meta calls this link_data.name).
     */
    headline: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),

    /**
     * Optional description/subheadline.
     */
    description: z
      .union([z.string().min(1), z.array(z.string().min(1)).min(1)])
      .optional(),

    /**
     * Optional URL parameters appended by Meta at delivery time.
     * Supports Meta dynamic macros like:
     * - {{site_source_name}}, {{placement}}
     * - {{campaign.id}}, {{campaign.name}}
     * - {{adset.id}}, {{adset.name}}
     * - {{ad.id}}, {{ad.name}}
     *
     * Example:
     * utm_source={{site_source_name}}&utm_campaign={{campaign.name}}&utm_term={{placement}}
     */
    urlTags: z.string().min(1).optional(),

    /**
     * Creative format.
     * - SINGLE_IMAGE: uses imagePath (and optional placementImages)
     * - CAROUSEL: uses carousel.cards[] images
     */
    format: metaAdsCreativeFormatSchema.optional().default("SINGLE_IMAGE"),

    /**
     * Local file path (repo-relative by default) to the creative image.
     * Required for SINGLE_IMAGE format.
     */
    imagePath: z.string().min(1).optional(),

    /**
     * Optional placement-specific images via Meta asset customization rules.
     * These are mapped to asset_feed_spec.images + asset_customization_rules.
     *
     * NOTE: This only applies to SINGLE_IMAGE format.
     */
    placementImages: z
      .array(metaAdsAssetCustomizationRuleSchema)
      .min(1)
      .optional(),

    /**
     * Optional carousel configuration (required when format is CAROUSEL).
     */
    carousel: metaAdsCarouselSchema.optional(),

    /**
     * CTA type (defaults to LEARN_MORE).
     */
    callToActionType: z.string().min(1).optional(),
  })
  .superRefine((creative, ctx) => {
    const format = creative.format ?? "SINGLE_IMAGE";

    if (format === "SINGLE_IMAGE") {
      if (!creative.imagePath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "creative.imagePath is required when creative.format is SINGLE_IMAGE",
          path: ["imagePath"],
        });
      }
      if (creative.carousel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "creative.carousel is only allowed when creative.format is CAROUSEL",
          path: ["carousel"],
        });
      }
    }

    if (format === "CAROUSEL") {
      if (!creative.carousel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "creative.carousel is required when creative.format is CAROUSEL",
          path: ["carousel"],
        });
      }
      if (creative.placementImages && creative.placementImages.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "creative.placementImages is not supported for CAROUSEL (use separate ads/ad sets per placement, or extend asset_feed_spec carousel later)",
          path: ["placementImages"],
        });
      }
    }
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

  /**
   * If true, the ad set is created as a Dynamic Creative ad set.
   * Required when you want a SINGLE ad to contain multiple text variants
   * via `asset_feed_spec` (bodies/titles/descriptions).
   *
   * Note: Meta enforces constraints for dynamic creative ad sets (e.g. typically one ad per ad set).
   */
  isDynamicCreative: z.boolean().optional(),

  /**
   * Optional pass-through fields for conversion/data-source configuration.
   * These map directly to Meta API fields on the ad set object.
   */
  destinationType: z.string().min(1).optional(),
  promotedObject: z.record(z.string(), z.unknown()).optional(),
  attributionSpec: z.array(z.unknown()).optional(),
  optimizationSubEvent: z.string().min(1).optional(),

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
