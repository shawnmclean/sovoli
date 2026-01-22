import { Command } from "commander";
import { metaApiRequest } from "../utils/meta-api.js";

interface CampaignResponse {
  id: string;
  name: string;
  objective: string;
  status: string;
  daily_budget?: string;
  lifetime_budget?: string;
}

interface AdSetResponse {
  id: string;
  name: string;
}

interface AdCreativeResponse {
  id: string;
}

interface AdResponse {
  id: string;
  name: string;
}

export const metaAdsCreateCampaignCommand = new Command(
  "meta-ads-create-campaign",
)
  .description("Create Meta (Facebook/Instagram) ad campaign")
  .requiredOption(
    "--system-user-token <systemUserToken>",
    "System User Token from meta-obo-setup",
  )
  .requiredOption(
    "--ad-account-id <adAccountId>",
    "Ad Account ID (with act_ prefix, e.g., 'act_1228289702450884')",
  )
  .requiredOption("--campaign-name <campaignName>", "Campaign name")
  .requiredOption(
    "--objective <objective>",
    "Campaign objective (e.g., 'OUTCOME_TRAFFIC', 'OUTCOME_ENGAGEMENT', 'OUTCOME_LEADS', 'OUTCOME_SALES')",
  )
  .option(
    "--daily-budget <dailyBudget>",
    "Daily budget in cents (e.g., 5000 = $50.00)",
    (value: string) => parseInt(value, 10),
  )
  .option(
    "--lifetime-budget <lifetimeBudget>",
    "Lifetime budget in cents (alternative to daily budget)",
    (value: string) => parseInt(value, 10),
  )
  .option("--bid-strategy <bidStrategy>", "Bid strategy", (value: string) => {
    const valid = [
      "LOWEST_COST_WITHOUT_CAP",
      "LOWEST_COST_WITH_BID_CAP",
      "COST_CAP",
    ];
    if (!valid.includes(value)) {
      throw new Error(
        `Invalid bid strategy: ${value}. Must be one of: ${valid.join(", ")}`,
      );
    }
    return value;
  })
  .option(
    "--bid-cap <bidCap>",
    "Bid cap in cents (required if bidStrategy is LOWEST_COST_WITH_BID_CAP or COST_CAP)",
    (value: string) => parseInt(value, 10),
  )
  .option(
    "--status <status>",
    "Campaign status",
    (value: string) => {
      if (value !== "ACTIVE" && value !== "PAUSED") {
        throw new Error(`Invalid status: ${value}. Must be ACTIVE or PAUSED`);
      }
      return value;
    },
    "PAUSED",
  )
  .option(
    "--special-ad-categories <specialAdCategories>",
    "Special ad categories (comma-separated, e.g., 'EMPLOYMENT,HOUSING,CREDIT')",
    (value: string) => value.split(",").map((v) => v.trim()),
  )
  .option("--api-version <apiVersion>", "Graph API version", "v24.0")
  // Ad Set parameters
  .option("--ad-set-name <adSetName>", "Ad Set name")
  .option(
    "--optimization-goal <optimizationGoal>",
    "Optimization goal (e.g., 'LINK_CLICKS', 'CONVERSIONS')",
  )
  .option(
    "--billing-event <billingEvent>",
    "Billing event (e.g., 'LINK_CLICKS', 'IMPRESSIONS')",
  )
  .option("--start-time <startTime>", "Start time (ISO 8601 format)")
  .option("--end-time <endTime>", "End time (ISO 8601 format)")
  .option(
    "--targeting-age-min <ageMin>",
    "Targeting: minimum age",
    (value: string) => parseInt(value, 10),
  )
  .option(
    "--targeting-age-max <ageMax>",
    "Targeting: maximum age",
    (value: string) => parseInt(value, 10),
  )
  .option(
    "--targeting-genders <genders>",
    "Targeting: genders (comma-separated, 1=male, 2=female)",
    (value: string) => value.split(",").map((v) => parseInt(v.trim(), 10)),
  )
  .option(
    "--targeting-countries <countries>",
    "Targeting: countries (comma-separated country codes, e.g., 'US,GB')",
    (value: string) => value.split(",").map((v) => v.trim()),
  )
  // Ad Creative parameters
  .option(
    "--page-id <pageId>",
    "Page ID for page promotion (from meta-obo-setup)",
  )
  .option(
    "--page-access-token <pageAccessToken>",
    "Page access token (from meta-obo-setup)",
  )
  .option("--ad-creative-name <adCreativeName>", "Ad creative name")
  .option("--ad-title <adTitle>", "Ad title")
  .option("--ad-body <adBody>", "Ad body text")
  .option("--image-url <imageUrl>", "Image URL")
  .option("--link-url <linkUrl>", "Link URL (destination)")
  .option(
    "--call-to-action-type <callToActionType>",
    "Call to action type (e.g., 'LEARN_MORE', 'SHOP_NOW', 'SIGN_UP')",
  )
  .action(
    async (options: {
      systemUserToken: string;
      adAccountId: string;
      campaignName: string;
      objective: string;
      dailyBudget?: number;
      lifetimeBudget?: number;
      bidStrategy?: string;
      bidCap?: number;
      status?: string;
      specialAdCategories?: string[];
      apiVersion?: string;
      adSetName?: string;
      optimizationGoal?: string;
      billingEvent?: string;
      startTime?: string;
      endTime?: string;
      targetingAgeMin?: number;
      targetingAgeMax?: number;
      targetingGenders?: number[];
      targetingCountries?: string[];
      pageId?: string;
      pageAccessToken?: string;
      adCreativeName?: string;
      adTitle?: string;
      adBody?: string;
      imageUrl?: string;
      linkUrl?: string;
      callToActionType?: string;
    }) => {
      // Validate required budget
      if (!options.dailyBudget && !options.lifetimeBudget) {
        console.error(
          "❌ Error: Either --daily-budget or --lifetime-budget is required",
        );
        process.exit(1);
      }

      if (options.dailyBudget && options.lifetimeBudget) {
        console.error(
          "❌ Error: Cannot specify both --daily-budget and --lifetime-budget",
        );
        process.exit(1);
      }

      // Validate bid strategy and bid cap
      if (
        (options.bidStrategy === "LOWEST_COST_WITH_BID_CAP" ||
          options.bidStrategy === "COST_CAP") &&
        !options.bidCap
      ) {
        console.error(
          `❌ Error: --bid-cap is required when --bid-strategy is ${options.bidStrategy}`,
        );
        process.exit(1);
      }

      // Format ad account ID (add act_ prefix if not present)
      const formattedAdAccountId = options.adAccountId.startsWith("act_")
        ? options.adAccountId
        : `act_${options.adAccountId}`;

      const apiVersion = options.apiVersion || "v24.0";

      console.log("🚀 Creating Meta Ad Campaign...\n");
      console.log(`   Campaign Name: ${options.campaignName}`);
      console.log(`   Objective: ${options.objective}`);
      console.log(`   Ad Account ID: ${formattedAdAccountId}`);
      console.log(`   Status: ${options.status || "PAUSED"}`);
      console.log(`   API Version: ${apiVersion}\n`);

      let campaignId = "";
      let adSetId = "";
      let adCreativeId = "";
      let adId = "";

      try {
        // Step 1: Create Campaign
        console.log("📋 Step 1: Creating campaign...");
        const campaignBody: Record<string, unknown> = {
          name: options.campaignName,
          objective: options.objective,
          status: options.status || "PAUSED",
        };

        if (options.dailyBudget) {
          campaignBody.daily_budget = options.dailyBudget;
        } else if (options.lifetimeBudget) {
          campaignBody.lifetime_budget = options.lifetimeBudget;
        }

        if (options.bidStrategy) {
          campaignBody.bid_strategy = options.bidStrategy;
        }

        if (options.bidCap) {
          campaignBody.bid_cap = options.bidCap;
        }

        // Special ad categories is required by Meta API - default to empty array if not provided
        campaignBody.special_ad_categories =
          options.specialAdCategories && options.specialAdCategories.length > 0
            ? options.specialAdCategories
            : [];

        const campaignResponse = await metaApiRequest<CampaignResponse>(
          `${formattedAdAccountId}/campaigns`,
          {
            method: "POST",
            accessToken: options.systemUserToken,
            apiVersion,
            body: campaignBody,
          },
        );

        campaignId = campaignResponse.id;
        console.log(`✅ Step 1: Campaign created`);
        console.log(`   Campaign ID: ${campaignId}\n`);

        // Step 2: Create Ad Set (if parameters provided)
        if (
          options.adSetName ||
          options.optimizationGoal ||
          options.billingEvent
        ) {
          console.log("📋 Step 2: Creating ad set...");

          // Ad set requires optimization_goal and billing_event
          if (!options.optimizationGoal || !options.billingEvent) {
            console.error(
              "❌ Error: --optimization-goal and --billing-event are required when creating an ad set",
            );
            process.exit(1);
          }

          const adSetBody: Record<string, unknown> = {
            name: options.adSetName || `${options.campaignName} - Ad Set 1`,
            campaign_id: campaignId,
            optimization_goal: options.optimizationGoal,
            billing_event: options.billingEvent,
          };

          if (options.dailyBudget) {
            adSetBody.daily_budget = options.dailyBudget;
          } else if (options.lifetimeBudget) {
            adSetBody.lifetime_budget = options.lifetimeBudget;
          }

          if (options.startTime) {
            adSetBody.start_time = options.startTime;
          }

          if (options.endTime) {
            adSetBody.end_time = options.endTime;
          }

          // Build targeting object if targeting parameters provided
          const targeting: Record<string, unknown> = {};
          if (
            options.targetingAgeMin !== undefined ||
            options.targetingAgeMax !== undefined ||
            options.targetingGenders ||
            options.targetingCountries
          ) {
            if (options.targetingAgeMin !== undefined) {
              targeting.age_min = options.targetingAgeMin;
            }
            if (options.targetingAgeMax !== undefined) {
              targeting.age_max = options.targetingAgeMax;
            }
            if (options.targetingGenders) {
              targeting.genders = options.targetingGenders;
            }
            if (options.targetingCountries) {
              targeting.geo_locations = {
                countries: options.targetingCountries,
              };
            }
          }

          // Add default targeting if any targeting was specified
          if (Object.keys(targeting).length > 0) {
            adSetBody.targeting = targeting;
          }

          const adSetResponse = await metaApiRequest<AdSetResponse>(
            `${formattedAdAccountId}/adsets`,
            {
              method: "POST",
              accessToken: options.systemUserToken,
              apiVersion,
              body: adSetBody,
            },
          );

          adSetId = adSetResponse.id;
          console.log(`✅ Step 2: Ad Set created`);
          console.log(`   Ad Set ID: ${adSetId}\n`);

          // Step 3: Create Ad Creative (if parameters provided)
          if (
            options.pageId ||
            options.adTitle ||
            options.imageUrl ||
            options.linkUrl
          ) {
            console.log("📋 Step 3: Creating ad creative...");

            const creativeBody: Record<string, unknown> = {
              name:
                options.adCreativeName ||
                `${options.campaignName} - Creative 1`,
            };

            // Page promotion (if pageId provided)
            if (options.pageId) {
              creativeBody.object_story_spec = {
                page_id: options.pageId,
              };

              if (options.adTitle || options.adBody || options.imageUrl) {
                const linkData: Record<string, unknown> = {};
                if (options.linkUrl) {
                  linkData.link = options.linkUrl;
                }
                if (options.adTitle) {
                  linkData.name = options.adTitle;
                }
                if (options.adBody) {
                  linkData.message = options.adBody;
                }
                if (options.imageUrl) {
                  linkData.image_url = options.imageUrl;
                }
                if (options.callToActionType) {
                  linkData.call_to_action = {
                    type: options.callToActionType,
                  };
                }

                if (Object.keys(linkData).length > 0) {
                  (
                    creativeBody.object_story_spec as Record<string, unknown>
                  ).link_data = linkData;
                }
              }
            } else {
              // Non-page promotion creative
              if (options.linkUrl) {
                creativeBody.object_story_spec = {
                  link_data: {
                    link: options.linkUrl,
                  },
                };
              }

              const linkData = (
                creativeBody.object_story_spec as Record<string, unknown>
              )?.link_data as Record<string, unknown> | undefined;

              if (linkData) {
                if (options.adTitle) {
                  linkData.name = options.adTitle;
                }
                if (options.adBody) {
                  linkData.message = options.adBody;
                }
                if (options.imageUrl) {
                  linkData.image_url = options.imageUrl;
                }
                if (options.callToActionType) {
                  linkData.call_to_action = {
                    type: options.callToActionType,
                  };
                }
              }
            }

            const adCreativeResponse = await metaApiRequest<AdCreativeResponse>(
              `${formattedAdAccountId}/adcreatives`,
              {
                method: "POST",
                accessToken: options.systemUserToken,
                apiVersion,
                body: creativeBody,
              },
            );

            adCreativeId = adCreativeResponse.id;
            console.log(`✅ Step 3: Ad Creative created`);
            console.log(`   Ad Creative ID: ${adCreativeId}\n`);

            // Step 4: Create Ad (if ad set and creative are created)
            if (adSetId && adCreativeId) {
              console.log("📋 Step 4: Creating ad...");

              const adBody: Record<string, unknown> = {
                name: `${options.campaignName} - Ad 1`,
                adset_id: adSetId,
                creative: {
                  creative_id: adCreativeId,
                },
                status: options.status || "PAUSED",
              };

              const adResponse = await metaApiRequest<AdResponse>(
                `${formattedAdAccountId}/ads`,
                {
                  method: "POST",
                  accessToken: options.systemUserToken,
                  apiVersion,
                  body: adBody,
                },
              );

              adId = adResponse.id;
              console.log(`✅ Step 4: Ad created`);
              console.log(`   Ad ID: ${adId}\n`);
            }
          }
        }

        // Output structured JSON
        console.log("📊 Campaign Creation Results:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        const output = {
          campaign: {
            id: campaignId,
            name: options.campaignName,
            objective: options.objective,
            status: options.status || "PAUSED",
            dailyBudget: options.dailyBudget,
            lifetimeBudget: options.lifetimeBudget,
          },
          ...(adSetId && {
            adSet: {
              id: adSetId,
              name: options.adSetName || `${options.campaignName} - Ad Set 1`,
            },
          }),
          ...(adCreativeId && {
            adCreative: {
              id: adCreativeId,
              name:
                options.adCreativeName ||
                `${options.campaignName} - Creative 1`,
            },
          }),
          ...(adId && {
            ad: {
              id: adId,
              name: `${options.campaignName} - Ad 1`,
            },
          }),
          credentials: {
            systemUserToken: options.systemUserToken,
            adAccountId: formattedAdAccountId,
          },
        };
        console.log(JSON.stringify(output, null, 2));
        console.log("");
        console.log("✅ Campaign creation completed successfully!");
      } catch (error) {
        console.error(
          "\n❌ Error during campaign creation:",
          error instanceof Error ? error.message : error,
        );
        if (campaignId) {
          console.error(`\n⚠️  Campaign was created (ID: ${campaignId})`);
          console.error("   You may need to manually clean it up.");
        }
        process.exit(1);
      }
    },
  );
