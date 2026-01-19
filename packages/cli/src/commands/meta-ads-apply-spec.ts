import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { metaApiRequest } from "../utils/meta-api.js";
import { metaAdsCampaignSpecSchema } from "../validation/schemas/meta-ads-campaign-spec.js";
import type { MetaAdsCampaignSpec } from "../validation/schemas/meta-ads-campaign-spec.js";

type CreatedCampaign = { id: string };
type CreatedAdSet = { id: string };
type CreatedAdCreative = { id: string };
type CreatedAd = { id: string };

type AdImagesResponse = {
  images?: Record<
    string,
    {
      hash?: string;
    }
  >;
  hash?: string;
};

function formatAdAccountId(adAccountId: string): string {
  return adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
}

function resolveRepoRoot(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, "../../../../");
}

function resolveFilePath(options: {
  repoRoot: string;
  specDir: string;
  maybeRelativePath: string;
}): string {
  const { repoRoot, specDir, maybeRelativePath } = options;

  if (path.isAbsolute(maybeRelativePath)) {
    return maybeRelativePath;
  }

  // Prefer repo-relative paths (as per plan)
  const repoResolved = path.resolve(repoRoot, maybeRelativePath);
  if (fs.existsSync(repoResolved)) {
    return repoResolved;
  }

  // Fallback: resolve relative to the spec file directory
  return path.resolve(specDir, maybeRelativePath);
}

function getImageHashFromAdImagesResponse(response: AdImagesResponse): string {
  if (typeof response.hash === "string" && response.hash.length > 0) {
    return response.hash;
  }

  const images = response.images;
  if (images && typeof images === "object") {
    const firstKey = Object.keys(images)[0];
    if (firstKey) {
      const hash = images[firstKey]?.hash;
      if (typeof hash === "string" && hash.length > 0) {
        return hash;
      }
    }
  }

  throw new Error(
    "Meta adimages response did not include an image hash (expected `hash` or `images[*].hash`)",
  );
}

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name} (set it in .env or your shell before running)`,
    );
  }
  return value;
}

function normalizeTextVariants(input: string | string[]): string[] {
  if (Array.isArray(input)) {
    if (input.length === 0) {
      throw new Error("Invalid creative text variants: array must not be empty");
    }
    return input;
  }
  return [input];
}

function firstVariant(input: string | string[]): string {
  if (Array.isArray(input)) {
    const first = input[0];
    if (!first) {
      throw new Error("Invalid creative text variants: array must not be empty");
    }
    return first;
  }
  return input;
}

function collectCreativeImagePaths(
  creative: MetaAdsCampaignSpec["ads"][number]["creative"],
): string[] {
  const paths: string[] = [];
  const format = creative.format || "SINGLE_IMAGE";

  if (format === "CAROUSEL") {
    const cards = creative.carousel?.cards || [];
    for (const card of cards) {
      paths.push(card.imagePath);
    }
    return paths;
  }

  if (creative.imagePath) {
    paths.push(creative.imagePath);
  }
  if (creative.placementImages && creative.placementImages.length > 0) {
    for (const rule of creative.placementImages) {
      paths.push(rule.imagePath);
    }
  }
  return paths;
}

function readAndParseSpec(specFilePath: string): MetaAdsCampaignSpec {
  const raw = fs.readFileSync(specFilePath, "utf-8");
  const parsed = JSON.parse(raw) as unknown;
  return metaAdsCampaignSpecSchema.parse(parsed);
}

function assertSpecIntegrity(spec: MetaAdsCampaignSpec): void {
  // Ensure adSet refs are unique
  const refs = new Set<string>();
  for (const adSet of spec.adSets) {
    if (refs.has(adSet.ref)) {
      throw new Error(`Duplicate adSets[].ref detected: ${adSet.ref}`);
    }
    refs.add(adSet.ref);
  }

  // Ensure every ad points to a valid ad set ref
  const validRefs = new Set(spec.adSets.map((a) => a.ref));
  for (const ad of spec.ads) {
    if (!validRefs.has(ad.adSetRef)) {
      throw new Error(
        `ads[].adSetRef "${ad.adSetRef}" does not match any adSets[].ref`,
      );
    }
  }

  // Dynamic Creative constraints:
  // - If any ad uses message/headline/description arrays, the referenced ad set must be marked
  //   isDynamicCreative and only ONE ad may reference that ad set.
  // - If ad set isDynamicCreative is true, only ONE ad may reference it.
  const adCountsByRef = new Map<string, number>();
  for (const ad of spec.ads) {
    adCountsByRef.set(ad.adSetRef, (adCountsByRef.get(ad.adSetRef) || 0) + 1);
  }

  const adSetByRef = new Map(spec.adSets.map((a) => [a.ref, a] as const));
  for (const ad of spec.ads) {
    const adSet = adSetByRef.get(ad.adSetRef);
    if (!adSet) continue;

    const usesTextArrays =
      Array.isArray(ad.creative.message) ||
      Array.isArray(ad.creative.headline) ||
      Array.isArray(ad.creative.description);

    const adCount = adCountsByRef.get(ad.adSetRef) || 0;

    if (adSet.isDynamicCreative && adCount > 1) {
      throw new Error(
        `adSets[].isDynamicCreative=true requires exactly 1 ad for ref "${ad.adSetRef}" (found ${adCount})`,
      );
    }

    if (usesTextArrays) {
      if (!adSet.isDynamicCreative) {
        throw new Error(
          `Ad "${ad.name}" uses text arrays, but ad set "${ad.adSetRef}" is not dynamic. Set adSets[].isDynamicCreative=true for "${ad.adSetRef}".`,
        );
      }
      if (adCount > 1) {
        throw new Error(
          `Ad "${ad.name}" uses text arrays, but dynamic creative ad set "${ad.adSetRef}" has ${adCount} ads. Meta requires 1 ad per dynamic creative ad set.`,
        );
      }
      if (ad.creative.placementImages && ad.creative.placementImages.length > 0) {
        throw new Error(
          `Ad "${ad.name}" uses text arrays and placementImages together; split into separate creatives (Meta dynamic rules).`,
        );
      }
      if ((ad.creative.format || "SINGLE_IMAGE") !== "SINGLE_IMAGE") {
        throw new Error(
          `Ad "${ad.name}" uses text arrays but is not SINGLE_IMAGE format.`,
        );
      }
    }
  }

  // Ensure there is a budget somewhere
  const campaignHasBudget =
    !!spec.campaign.budget?.dailyBudget || !!spec.campaign.budget?.lifetimeBudget;

  const allAdSetsHaveBudgets = spec.adSets.every(
    (a) => !!a.budget?.dailyBudget || !!a.budget?.lifetimeBudget,
  );

  if (!campaignHasBudget && !allAdSetsHaveBudgets) {
    throw new Error(
      "No budget configured. Provide campaign.budget (dailyBudget or lifetimeBudget) or provide budgets for every ad set (adSets[].budget).",
    );
  }
}

export const metaAdsApplySpecCommand = new Command("meta-ads-apply-spec")
  .description(
    "Create a PAUSED Meta campaign + ad sets + ads from a JSON spec file",
  )
  .requiredOption("--file <file>", "Path to spec JSON (repo-relative or absolute)")
  .option("--dry-run", "Validate spec and files (no API calls)", false)
  .option(
    "--api-version <apiVersion>",
    "Override Graph API version (e.g., v24.0)",
  )
  .option(
    "--write-results",
    "Write results.json next to the spec file",
    false,
  )
  .action(
    async (options: {
      file: string;
      dryRun?: boolean;
      apiVersion?: string;
      writeResults?: boolean;
    }) => {
      const repoRoot = resolveRepoRoot();
      const specFilePath = path.isAbsolute(options.file)
        ? options.file
        : path.resolve(repoRoot, options.file);
      const specDir = path.dirname(specFilePath);

      if (!fs.existsSync(specFilePath)) {
        console.error(`❌ Spec file not found: ${specFilePath}`);
        process.exit(1);
      }

      let spec: MetaAdsCampaignSpec;
      try {
        spec = readAndParseSpec(specFilePath);
        assertSpecIntegrity(spec);
      } catch (error) {
        console.error(
          "❌ Invalid spec:",
          error instanceof Error ? error.message : error,
        );
        process.exit(1);
      }

      const apiVersion = options.apiVersion || spec.meta.apiVersion || "v24.0";
      const adAccountId = formatAdAccountId(spec.meta.adAccountId);

      // Resolve and validate image files
      const uniqueImagePaths = Array.from(
        new Set(spec.ads.flatMap((a) => collectCreativeImagePaths(a.creative))),
      );

      const resolvedImages = uniqueImagePaths.map((imagePath) => {
        const resolved = resolveFilePath({
          repoRoot,
          specDir,
          maybeRelativePath: imagePath,
        });
        return { imagePath, resolvedPath: resolved };
      });

      const missingImages = resolvedImages.filter(
        (i) => !fs.existsSync(i.resolvedPath),
      );
      if (missingImages.length > 0) {
        console.error("❌ Missing image files referenced by spec:");
        for (const img of missingImages) {
          console.error(`   - ${img.imagePath} -> ${img.resolvedPath}`);
        }
        process.exit(1);
      }

      if (options.dryRun) {
        console.log("🔍 DRY RUN: Spec validated (no API calls).");
        console.log(`   Spec: ${specFilePath}`);
        console.log(`   API Version: ${apiVersion}`);
        console.log(`   Ad Account: ${adAccountId}`);
        console.log(`   Campaign: ${spec.campaign.name} (${spec.campaign.objective})`);
        console.log(`   Ad Sets: ${spec.adSets.length}`);
        console.log(`   Ads: ${spec.ads.length}`);
        console.log(`   Images: ${resolvedImages.length}`);
        return;
      }

      let accessToken: string;
      try {
        accessToken = requireEnvVar(spec.meta.systemUserTokenEnv);
      } catch (error) {
        console.error("❌ Missing credentials:", error);
        process.exit(1);
      }

      console.log("🚀 Applying Meta Ads spec (everything PAUSED)...\n");
      console.log(`   Spec: ${specFilePath}`);
      console.log(`   API Version: ${apiVersion}`);
      console.log(`   Ad Account: ${adAccountId}`);
      console.log(`   Campaign: ${spec.campaign.name}`);
      console.log("");

      const imagePathToHash = new Map<string, string>();
      const adSetRefToId = new Map<string, string>();
      const createdAds: Array<{
        name: string;
        adSetRef: string;
        adId: string;
        creativeId: string;
      }> = [];

      try {
        // 1) Upload images and get image_hash
        if (resolvedImages.length > 0) {
          console.log("📋 Step 1: Uploading images to ad account library...");
          for (const img of resolvedImages) {
            const bytes = fs.readFileSync(img.resolvedPath);
            const filename = path.basename(img.resolvedPath);

            const form = new FormData();
            form.append("filename", new Blob([bytes]), filename);

            const uploadResponse = await metaApiRequest<AdImagesResponse>(
              `${adAccountId}/adimages`,
              {
                method: "POST",
                accessToken,
                apiVersion,
                formData: form,
              },
            );

            const imageHash = getImageHashFromAdImagesResponse(uploadResponse);
            imagePathToHash.set(img.imagePath, imageHash);

            console.log(`   ✅ ${img.imagePath} -> ${imageHash}`);
          }
          console.log("");
        }

        // 2) Create campaign (PAUSED)
        console.log("📋 Step 2: Creating campaign (PAUSED)...");
        const campaignBody: Record<string, unknown> = {
          name: spec.campaign.name,
          objective: spec.campaign.objective,
          status: "PAUSED",
          special_ad_categories:
            spec.campaign.specialAdCategories && spec.campaign.specialAdCategories.length > 0
              ? spec.campaign.specialAdCategories
              : [],
        };

        if (spec.campaign.buyingType) {
          campaignBody.buying_type = spec.campaign.buyingType;
        }

        if (spec.campaign.budget?.dailyBudget) {
          campaignBody.daily_budget = spec.campaign.budget.dailyBudget;
        } else if (spec.campaign.budget?.lifetimeBudget) {
          campaignBody.lifetime_budget = spec.campaign.budget.lifetimeBudget;
        }

        const createdCampaign = await metaApiRequest<CreatedCampaign>(
          `${adAccountId}/campaigns`,
          { method: "POST", accessToken, apiVersion, body: campaignBody },
        );

        console.log(`✅ Campaign created: ${createdCampaign.id}\n`);

        // 3) Create ad sets (PAUSED)
        console.log("📋 Step 3: Creating ad sets (PAUSED)...");
        for (const adSet of spec.adSets) {
          const adSetBody: Record<string, unknown> = {
            name: adSet.name,
            campaign_id: createdCampaign.id,
            optimization_goal: adSet.optimizationGoal,
            billing_event: adSet.billingEvent,
            targeting: adSet.targeting,
            status: "PAUSED",
          };

          if (adSet.isDynamicCreative) {
            adSetBody.is_dynamic_creative = true;
          }

          if (adSet.destinationType) {
            adSetBody.destination_type = adSet.destinationType;
          }
          if (adSet.promotedObject) {
            adSetBody.promoted_object = adSet.promotedObject;
          }
          if (adSet.attributionSpec) {
            adSetBody.attribution_spec = adSet.attributionSpec;
          }
          if (adSet.optimizationSubEvent) {
            adSetBody.optimization_sub_event = adSet.optimizationSubEvent;
          }

          // Some accounts default to bid-cap/target-cost strategies that require a bid amount.
          // If provided in the spec, pass it through as `bid_amount`.
          if (adSet.bidAmount) {
            adSetBody.bid_amount = adSet.bidAmount;
          }

          if (adSet.budget?.dailyBudget) {
            adSetBody.daily_budget = adSet.budget.dailyBudget;
          } else if (adSet.budget?.lifetimeBudget) {
            adSetBody.lifetime_budget = adSet.budget.lifetimeBudget;
          }

          if (adSet.startTime) {
            adSetBody.start_time = adSet.startTime;
          }
          if (adSet.endTime) {
            adSetBody.end_time = adSet.endTime;
          }

          const createdAdSet = await metaApiRequest<CreatedAdSet>(
            `${adAccountId}/adsets`,
            { method: "POST", accessToken, apiVersion, body: adSetBody },
          );

          adSetRefToId.set(adSet.ref, createdAdSet.id);
          console.log(`✅ ${adSet.ref}: ${createdAdSet.id}`);
        }
        console.log("");

        // 4) Create creatives + ads (PAUSED)
        console.log("📋 Step 4: Creating creatives + ads (PAUSED)...");
        const createOneAd = async (
          ad: MetaAdsCampaignSpec["ads"][number],
        ): Promise<void> => {
          const adSetId = adSetRefToId.get(ad.adSetRef);
          if (!adSetId) {
            throw new Error(`Internal error: missing created ad set for ${ad.adSetRef}`);
          }

          const callToActionType = ad.creative.callToActionType || "LEARN_MORE";
          const creativeFormat = ad.creative.format || "SINGLE_IMAGE";

          const creativeName = ad.creative.name || `${ad.name} - Creative`;

          const baseObjectStorySpec: Record<string, unknown> = {
            page_id: ad.creative.pageId,
            ...(ad.creative.instagramActorId
              ? { instagram_actor_id: ad.creative.instagramActorId }
              : {}),
          };

          const creativeBody: Record<string, unknown> = (() => {
            // Carousel (link_data.child_attachments)
            if (creativeFormat === "CAROUSEL") {
              const cards = ad.creative.carousel?.cards || [];
              const childAttachments = cards.map((card) => {
                const cardHash = imagePathToHash.get(card.imagePath);
                if (!cardHash) {
                  throw new Error(
                    `Internal error: missing uploaded image hash for carousel card image ${card.imagePath}`,
                  );
                }

                return {
                  link: card.linkUrl || ad.creative.linkUrl,
                  image_hash: cardHash,
                  ...(card.headline ? { name: card.headline } : {}),
                  ...(card.description ? { description: card.description } : {}),
                };
              });

              const linkData: Record<string, unknown> = {
                link: ad.creative.linkUrl,
                message: firstVariant(ad.creative.message),
                name: firstVariant(ad.creative.headline),
                ...(ad.creative.description
                  ? { description: firstVariant(ad.creative.description) }
                  : {}),
                call_to_action: {
                  type: callToActionType,
                  value: {
                    link: ad.creative.linkUrl,
                  },
                },
                child_attachments: childAttachments,
                ...(ad.creative.carousel?.multiShareEndCard !== undefined
                  ? { multi_share_end_card: ad.creative.carousel.multiShareEndCard }
                  : {}),
                ...(ad.creative.carousel?.multiShareOptimized !== undefined
                  ? { multi_share_optimized: ad.creative.carousel.multiShareOptimized }
                  : {}),
              };

              return {
                name: creativeName,
                object_story_spec: {
                  ...baseObjectStorySpec,
                  link_data: linkData,
                },
                ...(ad.creative.urlTags ? { url_tags: ad.creative.urlTags } : {}),
              };
            }

            // Single-image with multiple text variants (no placement rules).
            const hasMultipleTextVariants =
              Array.isArray(ad.creative.message) ||
              Array.isArray(ad.creative.headline) ||
              Array.isArray(ad.creative.description);
            if (
              creativeFormat === "SINGLE_IMAGE" &&
              !ad.creative.placementImages &&
              hasMultipleTextVariants
            ) {
              const imagePath = ad.creative.imagePath;
              if (!imagePath) {
                throw new Error(
                  `Internal error: creative.imagePath is required for SINGLE_IMAGE (ad: ${ad.name})`,
                );
              }
              const imageHash = imagePathToHash.get(imagePath);
              if (!imageHash) {
                throw new Error(
                  `Internal error: missing uploaded image hash for ${imagePath}`,
                );
              }

              const assetFeedSpec: Record<string, unknown> = {
                ad_formats: ["SINGLE_IMAGE"],
                images: [{ hash: imageHash }],
                bodies: normalizeTextVariants(ad.creative.message).map((text) => ({ text })),
                titles: normalizeTextVariants(ad.creative.headline).map((text) => ({ text })),
                link_urls: [{ website_url: ad.creative.linkUrl }],
                call_to_action_types: [callToActionType],
              };

              if (ad.creative.description) {
                assetFeedSpec.descriptions = normalizeTextVariants(ad.creative.description).map(
                  (text) => ({ text }),
                );
              }

              return {
                name: creativeName,
                object_story_spec: baseObjectStorySpec,
                asset_feed_spec: assetFeedSpec,
                ...(ad.creative.urlTags ? { url_tags: ad.creative.urlTags } : {}),
              };
            }

            // Placement-customized single image (asset_feed_spec + asset_customization_rules)
            if (ad.creative.placementImages && ad.creative.placementImages.length > 0) {
              if (hasMultipleTextVariants) {
                throw new Error(
                  `placementImages does not support message/headline/description arrays. Create multiple ads instead (ad: ${ad.name}).`,
                );
              }

              const imagePath = ad.creative.imagePath;
              if (!imagePath) {
                throw new Error(
                  `Internal error: creative.imagePath is required for placementImages (ad: ${ad.name})`,
                );
              }
              const defaultHash = imagePathToHash.get(imagePath);
              if (!defaultHash) {
                throw new Error(
                  `Internal error: missing uploaded image hash for ${imagePath}`,
                );
              }

              const images: Array<Record<string, unknown>> = [
                // Default image (labeled for default rule)
                { hash: defaultHash, adlabels: [{ name: "img_default" }] },
              ];

              const assetCustomizationRules = ad.creative.placementImages.map((rule, idx) => {
                const ruleHash = imagePathToHash.get(rule.imagePath);
                if (!ruleHash) {
                  throw new Error(
                    `Internal error: missing uploaded image hash for placement image ${rule.imagePath}`,
                  );
                }

                const labelName = `img_rule_${idx + 1}`;
                images.push({ hash: ruleHash, adlabels: [{ name: labelName }] });

                return {
                  customization_spec: rule.customizationSpec,
                  image_label: { name: labelName },
                  priority: rule.priority ?? idx + 1,
                };
              });

              // Default rule required by Meta (empty customization_spec, lowest priority).
              assetCustomizationRules.push({
                customization_spec: {},
                image_label: { name: "img_default" },
                priority: 9999,
              });

              const assetFeedSpec: Record<string, unknown> = {
                ad_formats: ["SINGLE_IMAGE"],
                images,
                bodies: [{ text: firstVariant(ad.creative.message) }],
                titles: [{ text: firstVariant(ad.creative.headline) }],
                link_urls: [{ website_url: ad.creative.linkUrl }],
                call_to_action_types: [callToActionType],
                asset_customization_rules: assetCustomizationRules,
              };

              if (ad.creative.description) {
                assetFeedSpec.descriptions = [{ text: firstVariant(ad.creative.description) }];
              }

              return {
                name: creativeName,
                object_story_spec: baseObjectStorySpec,
                asset_feed_spec: assetFeedSpec,
                ...(ad.creative.urlTags ? { url_tags: ad.creative.urlTags } : {}),
              };
            }

            // Basic single-image link ad
            const imagePath = ad.creative.imagePath;
            if (!imagePath) {
              throw new Error(
                `Internal error: creative.imagePath is required for SINGLE_IMAGE (ad: ${ad.name})`,
              );
            }
            const imageHash = imagePathToHash.get(imagePath);
            if (!imageHash) {
              throw new Error(
                `Internal error: missing uploaded image hash for ${imagePath}`,
              );
            }

            return {
              name: creativeName,
              object_story_spec: {
                ...baseObjectStorySpec,
                link_data: {
                  link: ad.creative.linkUrl,
                  message: firstVariant(ad.creative.message),
                  name: firstVariant(ad.creative.headline),
                  ...(ad.creative.description
                    ? { description: firstVariant(ad.creative.description) }
                    : {}),
                  image_hash: imageHash,
                  call_to_action: {
                    type: callToActionType,
                    value: {
                      link: ad.creative.linkUrl,
                    },
                  },
                },
              },
              ...(ad.creative.urlTags ? { url_tags: ad.creative.urlTags } : {}),
            };
          })();

          const createdCreative = await metaApiRequest<CreatedAdCreative>(
            `${adAccountId}/adcreatives`,
            { method: "POST", accessToken, apiVersion, body: creativeBody },
          );

          const adBody: Record<string, unknown> = {
            name: ad.name,
            adset_id: adSetId,
            creative: {
              creative_id: createdCreative.id,
            },
            status: "PAUSED",
          };

          const createdAd = await metaApiRequest<CreatedAd>(
            `${adAccountId}/ads`,
            { method: "POST", accessToken, apiVersion, body: adBody },
          );

          createdAds.push({
            name: ad.name,
            adSetRef: ad.adSetRef,
            adId: createdAd.id,
            creativeId: createdCreative.id,
          });

          console.log(`✅ ${ad.name}: ${createdAd.id}`);
        };

        for (const ad of spec.ads) {
          const creativeFormat = ad.creative.format || "SINGLE_IMAGE";
          const hasMultipleTextVariants =
            Array.isArray(ad.creative.message) ||
            Array.isArray(ad.creative.headline) ||
            Array.isArray(ad.creative.description);

          // For "one ad, many text options", we keep a single ad and pass the arrays through
          // as asset_feed_spec (dynamic creative). So no expansion here.
          void creativeFormat;
          void hasMultipleTextVariants;
          await createOneAd(ad);
        }
        console.log("");

        const output = {
          specFile: specFilePath,
          meta: {
            apiVersion,
            adAccountId,
            systemUserTokenEnv: spec.meta.systemUserTokenEnv,
          },
          created: {
            campaign: {
              id: createdCampaign.id,
              name: spec.campaign.name,
              objective: spec.campaign.objective,
              status: "PAUSED",
            },
            adSets: spec.adSets.map((a) => ({
              ref: a.ref,
              name: a.name,
              id: adSetRefToId.get(a.ref) || "",
              status: "PAUSED",
            })),
            ads: createdAds.map((a) => ({
              name: a.name,
              adSetRef: a.adSetRef,
              id: a.adId,
              creativeId: a.creativeId,
              status: "PAUSED",
            })),
            images: resolvedImages.map((i) => ({
              imagePath: i.imagePath,
              resolvedPath: i.resolvedPath,
              imageHash: imagePathToHash.get(i.imagePath) || "",
            })),
          },
        };

        console.log("📊 Results:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(JSON.stringify(output, null, 2));
        console.log("");

        if (options.writeResults) {
          const resultsPath = path.join(specDir, "results.json");
          fs.writeFileSync(resultsPath, JSON.stringify(output, null, 2) + "\n");
          console.log(`💾 Wrote ${resultsPath}`);
        }

        console.log("\n✅ Spec applied successfully (everything is PAUSED).");
      } catch (error) {
        console.error(
          "\n❌ Error applying spec:",
          error instanceof Error ? error.message : error,
        );
        process.exit(1);
      }
    },
  );

