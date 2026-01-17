import { Command } from "commander";

interface MetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

interface SystemUserResponse {
  id: string;
  name?: string;
}

interface AccessTokenResponse {
  access_token: string;
}

interface PageAccount {
  access_token: string;
  category: string;
  category_list?: Array<{ id: string; name: string }>;
  name: string;
  id: string;
  tasks: string[];
}

interface PageAccountsResponse {
  data: PageAccount[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

/**
 * Make a request to Meta Graph API
 */
async function metaApiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    accessToken: string;
    apiVersion?: string;
    body?: Record<string, unknown>;
    params?: Record<string, string>;
  },
): Promise<T> {
  const { method = "GET", accessToken, apiVersion = "v24.0", body, params } =
    options;

  let url = `https://graph.facebook.com/${apiVersion}/${endpoint}`;

  // Add query parameters
  const queryParams = new URLSearchParams({
    access_token: accessToken,
    ...params,
  });
  url += `?${queryParams.toString()}`;

  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json()) as T | MetaApiError;

  if (!response.ok) {
    const error = data as MetaApiError;
    if (error.error) {
      throw new Error(
        `Meta API Error (${error.error.code}): ${error.error.message}${
          error.error.error_subcode
            ? ` (subcode: ${error.error.error_subcode})`
            : ""
        }`,
      );
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return data as T;
}

export const metaOboSetupCommand = new Command("meta-obo-setup")
  .description(
    "Set up Meta Business Manager On Behalf Of relationship and create system user for client",
  )
  .requiredOption(
    "--client-bm-id <clientBmId>",
    "Client Business Manager ID",
  )
  .requiredOption(
    "--user-access-token <userAccessToken>",
    "Access token of admin of client's Business Manager",
  )
  .option(
    "--asset-id <assetId>",
    "Asset ID (Page/Catalog) to assign to system user (can be provided multiple times)",
    (value: string, previous: string[] = []) => {
      return [...previous, value];
    },
    [] as string[],
  )
  .option(
    "--api-version <apiVersion>",
    "Graph API version (defaults to v24.0)",
    "v24.0",
  )
  .action(async (options: {
    clientBmId: string;
    userAccessToken: string;
    assetId?: string[];
    apiVersion?: string;
  }) => {
    // Validate environment variables
    const partnerBmId = process.env.META_PARTNER_BM_ID;
    if (!partnerBmId) {
      console.error(
        "❌ Error: META_PARTNER_BM_ID environment variable is required",
      );
      console.error(
        "   Set it in your .env file or export it before running the command",
      );
      process.exit(1);
    }

    const partnerSystemUserToken = process.env.META_PARTNER_SYSTEM_USER_TOKEN;
    if (!partnerSystemUserToken) {
      console.error(
        "❌ Error: META_PARTNER_SYSTEM_USER_TOKEN environment variable is required",
      );
      console.error(
        "   Set it in your .env file or export it before running the command",
      );
      process.exit(1);
    }

    const appId = process.env.META_APP_ID;
    if (!appId) {
      console.error("❌ Error: META_APP_ID environment variable is required");
      console.error(
        "   Set it in your .env file or export it before running the command",
      );
      process.exit(1);
    }

    const apiVersion = options.apiVersion || "v24.0";

    console.log("🚀 Starting Meta Business Manager On Behalf Of setup...\n");
    console.log(`   Partner BM ID: ${partnerBmId}`);
    console.log(`   Client BM ID: ${options.clientBmId}`);
    console.log(`   App ID: ${appId}`);
    console.log(`   API Version: ${apiVersion}\n`);

    let clientSystemUserToken = "";
    let systemUserId = "";

    try {
      // Step 1: Create On Behalf Of Relationship
      console.log("📋 Step 1: Creating On Behalf Of relationship...");
      await metaApiRequest<{ success: boolean }>(
        `${partnerBmId}/managed_businesses`,
        {
          method: "POST",
          accessToken: options.userAccessToken,
          apiVersion,
          params: {
            existing_client_business_id: options.clientBmId,
          },
        },
      );
      console.log("✅ Step 1: On Behalf Of relationship created\n");

      // Step 2: Create System User and Get Access Token
      console.log("📋 Step 2: Creating system user and getting access token...");
      const tokenResponse = await metaApiRequest<AccessTokenResponse>(
        `${options.clientBmId}/access_token`,
        {
          method: "POST",
          accessToken: partnerSystemUserToken,
          apiVersion,
          params: {
            scope: "ads_management,pages_read_engagement",
            app_id: appId,
          },
        },
      );

      clientSystemUserToken = tokenResponse.access_token;
      console.log("✅ Step 2: System user created");
      console.log(`   System User Token: ${clientSystemUserToken}\n`);

      // Step 3: Get System User ID
      console.log("📋 Step 3: Getting system user ID...");
      const userResponse = await metaApiRequest<SystemUserResponse>("me", {
        accessToken: clientSystemUserToken,
        apiVersion,
      });

      systemUserId = userResponse.id;
      console.log(`✅ Step 3: System User ID: ${systemUserId}\n`);

      // Step 4: Assign Assets to System User (optional)
      const assetIds = options.assetId || [];
      if (assetIds.length > 0) {
        console.log("📋 Step 4: Assigning assets to system user...");
        for (const assetId of assetIds) {
          try {
            await metaApiRequest<{ success: boolean }>(
              `${assetId}/assigned_users`,
              {
                method: "POST",
                accessToken: options.userAccessToken,
                apiVersion,
                params: {
                  user: systemUserId,
                  tasks: "MANAGE",
                },
              },
            );
            console.log(`✅ Step 4: Asset ${assetId} assigned to system user`);
          } catch (error) {
            console.error(
              `⚠️  Warning: Failed to assign asset ${assetId}:`,
              error instanceof Error ? error.message : error,
            );
          }
        }
        console.log("");
      } else {
        console.log("⏭️  Step 4: Skipped (no assets provided)\n");
      }

      // Step 5: Display System User Token for Storage
      console.log("📋 Step 5: System user token ready for storage");
      console.log(`✅ Step 5: Store this token securely: ${clientSystemUserToken}\n`);

      // Step 6: Generate Page Access Token
      console.log("📋 Step 6: Generating page access tokens...");
      const accountsResponse = await metaApiRequest<PageAccountsResponse>(
        "me/accounts",
        {
          accessToken: clientSystemUserToken,
          apiVersion,
        },
      );

      if (accountsResponse.data && accountsResponse.data.length > 0) {
        console.log("✅ Step 6: Page Access Tokens:");
        for (const page of accountsResponse.data) {
          console.log(`   - Page: ${page.name} (${page.id})`);
          console.log(`     Token: ${page.access_token}`);
        }
      } else {
        console.log(
          "⚠️  Step 6: No pages found for this system user",
        );
      }

      console.log("\n🎉 Setup completed successfully!");
      console.log("\n📝 Summary:");
      console.log(`   System User ID: ${systemUserId}`);
      console.log(`   System User Token: ${clientSystemUserToken}`);
      if (accountsResponse.data && accountsResponse.data.length > 0) {
        console.log(`   Pages: ${accountsResponse.data.length}`);
      }
    } catch (error) {
      console.error("\n❌ Error during setup:", error instanceof Error ? error.message : error);
      if (clientSystemUserToken) {
        console.error("\n⚠️  Partial setup completed. System user token:");
        console.error(`   ${clientSystemUserToken}`);
      }
      process.exit(1);
    }
  });
