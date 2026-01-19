import { Command } from "commander";
import { metaApiRequest } from "../utils/meta-api.js";

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

interface BusinessManagerInfo {
  id: string;
  name: string;
  primary_page?: { id: string; name: string };
  timezone_id?: number;
  verification_status?: string;
}

interface AssignedUser {
  id: string;
  name?: string;
  tasks: string[];
}

interface AssignedUsersResponse {
  data: AssignedUser[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

interface AdAccount {
  id: string;
  name: string;
  account_id: string;
  currency: string;
}

interface AdAccountsResponse {
  data: AdAccount[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

export const metaOboSetupCommand = new Command("meta-obo-setup")
  .description(
    "Set up Meta Business Manager On Behalf Of relationship and create system user for client",
  )
  .option(
    "--client-bm-id <clientBmId>",
    "Client Business Manager ID (defaults to META_CLIENT_BM_ID from .env)",
  )
  .requiredOption(
    "--user-access-token <userAccessToken>",
    "Access token of admin of client's Business Manager",
  )
  .option(
    "--page-id <pageId>",
    "Page ID to assign to system user (can be provided multiple times)",
    (value: string, previous: string[] = []) => {
      return [...previous, value];
    },
    [] as string[],
  )
  .option(
    "--ad-account-id <adAccountId>",
    "Ad Account ID (numeric, will be prefixed with act_) to assign to system user (can be provided multiple times)",
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
  .action(
    async (options: {
      clientBmId?: string;
      userAccessToken: string;
      pageId?: string[];
      adAccountId?: string[];
      apiVersion?: string;
    }) => {
      const clientBmId = options.clientBmId || process.env.META_CLIENT_BM_ID;
      if (!clientBmId) {
        console.error(
          "❌ Error: Client Business Manager ID is required. Provide --client-bm-id or set META_CLIENT_BM_ID in your .env file.",
        );
        process.exit(1);
      }

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

      const partnerSystemUserToken =
        process.env.META_PARTNER_SYSTEM_USER_TOKEN ||
        process.env.PARTNER_BM_ADMIN_SYSTEM_USER_ACCESS_TOKEN;
      if (!partnerSystemUserToken) {
        console.error(
          "❌ Error: META_PARTNER_SYSTEM_USER_TOKEN or PARTNER_BM_ADMIN_SYSTEM_USER_ACCESS_TOKEN environment variable is required",
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
      console.log(`   Client BM ID: ${clientBmId}`);
      console.log(`   App ID: ${appId}`);
      console.log(`   API Version: ${apiVersion}\n`);

      let clientSystemUserToken = "";
      let systemUserId = "";
      let businessManagerInfo: BusinessManagerInfo | null = null;
      let pageAccounts: PageAccount[] = [];
      let adAccounts: AdAccount[] = [];

      try {
        // Step 1: Create On Behalf Of Relationship
        console.log("📋 Step 1: Creating On Behalf Of relationship...");
        console.log(
          `   Partner BM: ${partnerBmId} -> Client BM: ${clientBmId}`,
        );
        await metaApiRequest<{ success: boolean }>(
          `${partnerBmId}/managed_businesses`,
          {
            method: "POST",
            accessToken: options.userAccessToken,
            apiVersion,
            params: {
              existing_client_business_id: clientBmId,
            },
          },
        );
        console.log("✅ Step 1: On Behalf Of relationship created\n");

        // Step 1a: Fetch Business Manager Information
        console.log("📋 Step 1a: Fetching Business Manager information...");
        try {
          businessManagerInfo = await metaApiRequest<BusinessManagerInfo>(
            clientBmId,
            {
              accessToken: options.userAccessToken,
              apiVersion,
              params: {
                fields: "id,name,primary_page,timezone_id,verification_status",
              },
            },
          );
          console.log(`✅ Step 1a: Business Manager Information retrieved`);
          console.log(`   Name: ${businessManagerInfo.name}`);
          console.log(`   ID: ${businessManagerInfo.id}`);
          if (businessManagerInfo.verification_status) {
            console.log(
              `   Verification Status: ${businessManagerInfo.verification_status}`,
            );
          }
          console.log("");
        } catch (error) {
          console.warn(
            `⚠️  Step 1a: Could not fetch Business Manager info (may require additional permissions)`,
          );
          console.warn(
            `   ${error instanceof Error ? error.message : String(error)}`,
          );
          console.log("");
        }

        // Step 2: Create System User and Get Access Token
        console.log(
          "📋 Step 2: Creating system user and getting access token...",
        );
        console.log(
          `   Creating system user in Client BM: ${clientBmId}`,
        );
        console.log(
          `   Using Partner System User Token from BM: ${partnerBmId}`,
        );
        const tokenResponse = await metaApiRequest<AccessTokenResponse>(
          `${clientBmId}/access_token`,
          {
            method: "POST",
            accessToken: partnerSystemUserToken,
            apiVersion,
            params: {
              scope: "ads_management,pages_read_engagement,business_management",
              app_id: appId,
            },
          },
        );

        clientSystemUserToken = tokenResponse.access_token;
        console.log("✅ Step 2: System user created in Client BM");
        console.log(`   System User Token: ${clientSystemUserToken}\n`);

        // Step 3: Get System User ID
        console.log("📋 Step 3: Getting system user ID...");
        const userResponse = await metaApiRequest<SystemUserResponse>("me", {
          accessToken: clientSystemUserToken,
          apiVersion,
        });

        systemUserId = userResponse.id;
        const systemUserName = userResponse.name || "Unknown";
        console.log(`✅ Step 3: System User ID: ${systemUserId}`);
        console.log(`   System User Name: ${systemUserName}\n`);

        // Step 4: Assign Pages and Ad Accounts to System User (optional)
        const pageIds = options.pageId || [];
        const adAccountIds = options.adAccountId || [];
        // Hardcode tasks to full control: MANAGE, ADVERTISE, ANALYZE
        const tasks = "MANAGE,ADVERTISE,ANALYZE";

        if (pageIds.length > 0 || adAccountIds.length > 0) {
          console.log("📋 Step 4: Assigning assets to system user...");
          console.log(
            `   Assigning assets in Client BM: ${clientBmId}`,
          );
          console.log(`   System User ID: ${systemUserId}`);
          console.log(
            `   Tasks/Permissions: ${tasks} (hardcoded for full control)\n`,
          );

          // Step 4a: Assign Pages
          if (pageIds.length > 0) {
            console.log("   📄 Assigning Pages...");
            for (const pageId of pageIds) {
              try {
                console.log(`   Attempting to assign page: ${pageId}`);
                await metaApiRequest<{ success: boolean }>(
                  `${pageId}/assigned_users`,
                  {
                    method: "POST",
                    accessToken: options.userAccessToken,
                    apiVersion,
                    params: {
                      user: systemUserId,
                      tasks,
                    },
                  },
                );
                console.log(
                  `   ✅ Page ${pageId} assigned to system user ${systemUserId} with tasks: ${tasks}`,
                );

                // Verify assignment by reading assigned_users (use user token for this check)
                try {
                  const assignedUsersResponse =
                    await metaApiRequest<AssignedUsersResponse>(
                      `${pageId}/assigned_users`,
                      {
                        accessToken: options.userAccessToken,
                        apiVersion,
                      },
                    );
                  const systemUserInList = assignedUsersResponse.data.find(
                    (user) => user.id === systemUserId,
                  );
                  if (systemUserInList) {
                    console.log(
                      `   ✓ Verified: System user ${systemUserId} found in assigned_users for page ${pageId}`,
                    );
                    console.log(
                      `     Tasks: ${systemUserInList.tasks.join(", ")}`,
                    );
                  } else {
                    console.warn(
                      `   ⚠️  Warning: System user ${systemUserId} not found in assigned_users list for page ${pageId}`,
                    );
                  }
                } catch (verifyError) {
                  console.warn(
                    `   ⚠️  Could not verify assignment for page ${pageId}:`,
                    verifyError instanceof Error
                      ? verifyError.message
                      : verifyError,
                  );
                }
              } catch (error) {
                const errorMessage =
                  error instanceof Error ? error.message : String(error);
                console.error(
                  `   ⚠️  Warning: Failed to assign page ${pageId}:`,
                  errorMessage,
                );
              }
            }
            console.log("");
          }

          // Step 4b: Assign Ad Accounts
          if (adAccountIds.length > 0) {
            console.log("   💰 Assigning Ad Accounts...");
            for (const adAccountId of adAccountIds) {
              try {
                // Format ad account ID with act_ prefix
                const formattedAdAccountId = adAccountId.startsWith("act_")
                  ? adAccountId
                  : `act_${adAccountId}`;
                console.log(
                  `   Attempting to assign ad account: ${formattedAdAccountId}`,
                );
                await metaApiRequest<{ success: boolean }>(
                  `${formattedAdAccountId}/assigned_users`,
                  {
                    method: "POST",
                    accessToken: options.userAccessToken,
                    apiVersion,
                    params: {
                      user: systemUserId,
                      tasks,
                    },
                  },
                );
                console.log(
                  `   ✅ Ad Account ${formattedAdAccountId} assigned to system user ${systemUserId} with tasks: ${tasks}`,
                );
              } catch (error) {
                const errorMessage =
                  error instanceof Error ? error.message : String(error);
                console.error(
                  `   ⚠️  Warning: Failed to assign ad account ${adAccountId}:`,
                  errorMessage,
                );
                if (
                  errorMessage.includes("does not exist") ||
                  errorMessage.includes("missing permissions")
                ) {
                  console.error(
                    `      💡 Tip: Make sure the ad account ID is correct and exists in Client BM: ${clientBmId}`,
                  );
                }
              }
            }
            console.log("");
          }
        } else {
          console.log(
            "⏭️  Step 4: Skipped (no pages or ad accounts provided)\n",
          );
        }

        // Step 5: Display System User Token for Storage
        console.log("📋 Step 5: System user token ready for storage");
        console.log(
          `✅ Step 5: Store this token securely: ${clientSystemUserToken}\n`,
        );

        // Step 6: Generate Page Access Token
        console.log("📋 Step 6: Generating page access tokens...");
        console.log(
          `   Using system user token from Client BM: ${clientBmId}`,
        );
        const accountsResponse = await metaApiRequest<PageAccountsResponse>(
          "me/accounts",
          {
            accessToken: clientSystemUserToken,
            apiVersion,
          },
        );

        pageAccounts = accountsResponse.data || [];

        if (pageAccounts.length > 0) {
          console.log("✅ Step 6: Page Access Tokens:");
          for (const page of pageAccounts) {
            console.log(`   - Page: ${page.name} (${page.id})`);
            console.log(`     Token: ${page.access_token}`);
          }
        } else {
          console.log("⚠️  Step 6: No pages found for this system user");
        }
        console.log("");

        // Step 7: List Ad Accounts accessible via system user
        console.log(
          "📋 Step 7: Listing client ad accounts in Business Manager...",
        );
        console.log(
          `   Using system user token from Client BM: ${clientBmId}`,
        );
        try {
          const adAccountsResponse = await metaApiRequest<AdAccountsResponse>(
            `${clientBmId}/client_ad_accounts`,
            {
              accessToken: clientSystemUserToken,
              apiVersion,
              params: {
                fields: "id,name,account_id,currency",
              },
            },
          );

          adAccounts = adAccountsResponse.data || [];

          if (adAccounts.length > 0) {
            console.log(
              "✅ Step 7: Client Ad Accounts (accessible via system user):",
            );
            for (const account of adAccounts) {
              console.log(`   - ${account.name} (ID: ${account.id})`);
              console.log(`     Account ID: ${account.account_id}`);
              console.log(`     Currency: ${account.currency}`);
            }
          } else {
            console.log(
              "⚠️  Step 7: No client ad accounts found in Business Manager",
            );
          }
        } catch (error) {
          console.warn(`⚠️  Step 7: Could not list client ad accounts`);
          console.warn(
            `   ${error instanceof Error ? error.message : String(error)}`,
          );
        }
        console.log("");

        // Final Summary
        console.log("🎉 Setup completed successfully!");
        console.log("\n📊 Final Summary:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        // Business Manager Information
        if (businessManagerInfo) {
          console.log("Business Manager Information:");
          console.log(`  ID: ${businessManagerInfo.id}`);
          console.log(`  Name: ${businessManagerInfo.name}`);
          if (businessManagerInfo.verification_status) {
            console.log(
              `  Verification Status: ${businessManagerInfo.verification_status}`,
            );
          }
          if (businessManagerInfo.primary_page) {
            console.log(
              `  Primary Page: ${businessManagerInfo.primary_page.name} (${businessManagerInfo.primary_page.id})`,
            );
          }
          console.log("");
        }

        // Pages
        if (pageAccounts.length > 0) {
          console.log("Pages:");
          for (const page of pageAccounts) {
            console.log(`  - ${page.name} (ID: ${page.id})`);
            console.log(`    Access Token: ${page.access_token}`);
          }
          console.log("");
        } else {
          console.log("Pages: None found\n");
        }

        // Ad Accounts
        if (adAccounts.length > 0) {
          console.log("Client Ad Accounts (accessible via system user):");
          for (const account of adAccounts) {
            console.log(`  - ${account.name} (ID: ${account.id})`);
            console.log(`    Account ID: ${account.account_id}`);
            console.log(`    Currency: ${account.currency}`);
          }
          console.log("");
        } else {
          console.log("Client Ad Accounts: None found\n");
        }

        // Tokens
        console.log("Tokens (store securely):");
        console.log(`  System User Token: ${clientSystemUserToken}`);
        if (pageAccounts.length > 0) {
          console.log(
            `  Page Access Tokens: ${pageAccounts.length} token(s) listed above`,
          );
        }
        console.log("");

        // Structured Output for Campaign Creation
        console.log("📋 Campaign Creation Credentials (JSON):");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        const campaignCredentials = {
          businessManager: {
            id: clientBmId,
            name: businessManagerInfo?.name || "Unknown",
          },
          systemUser: {
            id: systemUserId,
            token: clientSystemUserToken,
            permissions: [
              "ads_management",
              "pages_read_engagement",
              "business_management",
            ],
          },
          adAccounts: adAccounts.map((account) => ({
            id: account.id,
            accountId: account.account_id,
            name: account.name,
            currency: account.currency,
          })),
          pages: pageAccounts.map((page) => ({
            id: page.id,
            name: page.name,
            accessToken: page.access_token,
          })),
        };
        console.log(JSON.stringify(campaignCredentials, null, 2));
        console.log("");
        console.log("💡 Use these credentials to create campaigns:");
        console.log(`   - System User Token: ${clientSystemUserToken}`);
        console.log(
          `   - Ad Account IDs: ${adAccounts.map((a) => a.id).join(", ") || "None"}`,
        );
        console.log(`   - Page Access Tokens: See pages array above`);
        console.log("");
      } catch (error) {
        console.error(
          "\n❌ Error during setup:",
          error instanceof Error ? error.message : error,
        );
        if (clientSystemUserToken) {
          console.error("\n⚠️  Partial setup completed. System user token:");
          console.error(`   ${clientSystemUserToken}`);
        }
        process.exit(1);
      }
    },
  );
