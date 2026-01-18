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
        new Set(spec.ads.map((a) => a.creative.imagePath)),
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
        for (const ad of spec.ads) {
          const adSetId = adSetRefToId.get(ad.adSetRef);
          if (!adSetId) {
            throw new Error(`Internal error: missing created ad set for ${ad.adSetRef}`);
          }

          const imageHash = imagePathToHash.get(ad.creative.imagePath);
          if (!imageHash) {
            throw new Error(
              `Internal error: missing uploaded image hash for ${ad.creative.imagePath}`,
            );
          }

          const callToActionType = ad.creative.callToActionType || "LEARN_MORE";

          const creativeBody: Record<string, unknown> = {
            name: ad.creative.name || `${ad.name} - Creative`,
            object_story_spec: {
              page_id: ad.creative.pageId,
              link_data: {
                link: ad.creative.linkUrl,
                message: ad.creative.message,
                name: ad.creative.headline,
                ...(ad.creative.description
                  ? { description: ad.creative.description }
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
          };

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

