import { Command } from "commander";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../../");

interface PostHogLeadUpdatedEvent {
  timestamp: string;
  distinct_id: string;
  properties: {
    leadId?: string;
    contactOutcome?: string;
    notReachedReason?: string;
    interestLevel?: string;
    blocker?: string;
    nextAction?: string;
    notes?: string;
    loggedAt?: string;
    tenant?: string;
    cycleId?: string;
    programId?: string;
    programName?: string;
    cycleLabel?: string;
    [key: string]: unknown;
  };
}

interface PostHogPerson {
  distinct_id: string;
  properties: {
    phone?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    [key: string]: unknown;
  };
}

interface LeadInteraction {
  loggedAt: string;
  contactOutcome: string;
  notReachedReason?: string;
  interestLevel?: string;
  blocker?: string;
  nextAction?: string;
  notes?: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  programId: string;
  cycleId: string;
  submittedAt: string;
  selection?: string;
  interactions?: LeadInteraction[];
}

/**
 * Query PostHog using HogQL - matches MCP tool structure
 */
async function queryPostHog(
  apiKey: string,
  projectId: string,
  query: string,
  filters?: {
    dateRange?: {
      date_from?: string;
      date_to?: string | null;
      explicitDate?: boolean;
    };
    filterTestAccounts?: boolean;
  },
): Promise<unknown> {
  // Use DataVisualizationNode structure like MCP tool does
  const requestBody: {
    query: {
      kind: string;
      source: {
        kind: string;
        query: string;
        filters?: {
          dateRange?: {
            date_from?: string;
            date_to?: string | null;
            explicitDate?: boolean;
          };
          filterTestAccounts?: boolean;
        };
      };
    };
    name?: string;
  } = {
    query: {
      kind: "DataVisualizationNode",
      source: {
        kind: "HogQLQuery",
        query,
        ...(filters && { filters }),
      },
    },
    name: "sync_posthog_leads",
  };

  const response = await fetch(
    `https://us.i.posthog.com/api/projects/${projectId}/query/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `PostHog API error: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return response.json();
}

/**
 * Get LeadUpdated events from PostHog for the last 30 days
 * These contain interaction data that should be added to existing leads
 */
async function getLeadUpdatedEvents(
  apiKey: string,
  projectId: string,
  tenant: string,
  programId: string,
): Promise<PostHogLeadUpdatedEvent[]> {
  // Query LeadUpdated events - same structure as MCP tool
  const query = `
    SELECT
      timestamp,
      distinct_id,
      properties
    FROM events
    WHERE
      event = 'LeadUpdated'
      AND timestamp >= now() - INTERVAL 30 DAY
      AND properties.tenant = '${tenant}'
      AND (
        properties.programId = '${programId}'
        OR ilike(toString(properties.programId), '%massage%')
      )
    ORDER BY timestamp DESC
  `;

  // Use filters like MCP tool does
  const filters = {
    dateRange: {
      date_from: "-30d",
      date_to: null,
      explicitDate: false,
    },
    filterTestAccounts: false,
  };

  const result = (await queryPostHog(apiKey, projectId, query, filters)) as {
    results?: unknown[][];
    columns?: string[];
  };

  if (!result.results || result.results.length === 0) {
    return [];
  }

  // Parse results - columns: timestamp, distinct_id, properties
  const events: PostHogLeadUpdatedEvent[] = [];
  const columns = result.columns || ["timestamp", "distinct_id", "properties"];
  const timestampIdx = columns.indexOf("timestamp");
  const distinctIdIdx = columns.indexOf("distinct_id");
  const propertiesIdx = columns.indexOf("properties");

  for (const row of result.results) {
    if (!Array.isArray(row) || row.length < 3) continue;

    const timestamp = String(row[timestampIdx] || row[0] || "");
    const distinctId = String(row[distinctIdIdx] || row[1] || "");
    const propertiesValue = row[propertiesIdx] || row[2];

    // Properties might be a string (JSON) or already an object
    let properties: Record<string, unknown>;
    if (typeof propertiesValue === "string") {
      try {
        properties = JSON.parse(propertiesValue);
      } catch (e) {
        console.warn(`Failed to parse properties for ${distinctId}:`, e);
        continue;
      }
    } else if (typeof propertiesValue === "object" && propertiesValue !== null) {
      properties = propertiesValue as Record<string, unknown>;
    } else {
      console.warn(`Invalid properties format for ${distinctId}`);
      continue;
    }

    // Only include events that have a leadId
    if (!properties.leadId) {
      continue;
    }

    events.push({
      timestamp,
      distinct_id: distinctId,
      properties,
    });
  }

  return events;
}


/**
 * Get the next lead ID
 */
function getNextLeadId(existingLeads: Lead[]): string {
  const ids = existingLeads
    .map((lead) => {
      const match = lead.id.match(/^lead-(\d+)$/);
      return match ? parseInt(match[1] || "0", 10) : 0;
    })
    .filter((id) => !isNaN(id));

  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `lead-${maxId + 1}`;
}

/**
 * Find leads JSON file for tenant
 */
function findLeadsJsonFile(tenant: string): string | null {
  // Try the known path for healingemeraldwellness
  const knownPath = path.join(
    ROOT_DIR,
    "apps/sovoli.com/src/modules/data/organisations/vocational-school/jamaica",
    tenant,
    "leads.json",
  );

  if (fs.existsSync(knownPath)) {
    return knownPath;
  }

  // Could search more broadly, but for now just return the known path
  return knownPath;
}

export const syncPosthogLeadsCommand = new Command("sync-posthog-leads")
  .description("Sync leads from PostHog for a tenant and program")
  .requiredOption(
    "-t, --tenant <tenant>",
    "Tenant username (e.g., healingemeraldwellness)",
  )
  .requiredOption(
    "-p, --program-id <programId>",
    "Program ID (e.g., hew-massage-therapy)",
  )
  .option(
    "--project-id <projectId>",
    "PostHog project ID (defaults to POSTHOG_PROJECT_ID env var)",
  )
  .option(
    "--dry-run",
    "Show what would be updated without making changes",
    false,
  )
  .action(async (options: {
    tenant: string;
    programId: string;
    projectId?: string;
    dryRun?: boolean;
  }) => {
    const apiKey = process.env.POSTHOG_API_KEY;
    if (!apiKey) {
      console.error(
        "❌ Error: POSTHOG_API_KEY environment variable is required",
      );
      console.error(
        "   Set it in your .env file or export it before running the command",
      );
      process.exit(1);
    }

    const projectId =
      options.projectId || process.env.POSTHOG_PROJECT_ID || "";
    if (!projectId) {
      console.error(
        "❌ Error: PostHog project ID is required. Set POSTHOG_PROJECT_ID env var or use --project-id",
      );
      process.exit(1);
    }

    const leadsJsonPath = findLeadsJsonFile(options.tenant);
    if (!leadsJsonPath || !fs.existsSync(leadsJsonPath)) {
      console.error(
        `❌ Error: Leads JSON file not found for tenant: ${options.tenant}`,
      );
      console.error(`   Expected path: ${leadsJsonPath}`);
      process.exit(1);
    }

    console.log(`📥 Fetching LeadUpdated events from PostHog...`);
    console.log(`   Tenant: ${options.tenant}`);
    console.log(`   Program ID: ${options.programId}`);
    console.log(`   Project ID: ${projectId}\n`);

    try {
      // Load existing leads first
      const existingLeadsData = JSON.parse(
        fs.readFileSync(leadsJsonPath, "utf8"),
      ) as { leads: Lead[] };
      const existingLeads = existingLeadsData.leads || [];

      // Create a map of existing leads by ID
      const leadsById = new Map<string, Lead>();
      existingLeads.forEach((lead) => {
        leadsById.set(lead.id, lead);
      });

      // Get LeadUpdated events
      const updatedEvents = await getLeadUpdatedEvents(
        apiKey,
        projectId,
        options.tenant,
        options.programId,
      );

      console.log(`✅ Found ${updatedEvents.length} LeadUpdated event(s)\n`);

      if (updatedEvents.length === 0) {
        console.log("No new interactions to sync.");
        process.exit(0);
      }

      // Process each LeadUpdated event and add interactions to existing leads
      let newInteractionsCount = 0;
      let skippedLeads = 0;
      const updatedLeads = [...existingLeads];

      for (const event of updatedEvents) {
        const leadId = event.properties.leadId as string;
        if (!leadId) {
          continue;
        }

        const lead = leadsById.get(leadId);
        if (!lead) {
          skippedLeads++;
          continue;
        }

        // Create interaction from event properties
        const loggedAt = event.properties.loggedAt as string || event.timestamp;
        const interaction: LeadInteraction = {
          loggedAt,
          contactOutcome: event.properties.contactOutcome as string || "",
          ...(event.properties.notReachedReason && {
            notReachedReason: event.properties.notReachedReason as string,
          }),
          ...(event.properties.interestLevel && {
            interestLevel: event.properties.interestLevel as string,
          }),
          ...(event.properties.blocker && {
            blocker: event.properties.blocker as string,
          }),
          ...(event.properties.nextAction && {
            nextAction: event.properties.nextAction as string,
          }),
          ...(event.properties.notes && {
            notes: event.properties.notes as string,
          }),
        };

        // Check if this interaction already exists (by loggedAt)
        const leadIndex = updatedLeads.findIndex((l) => l.id === leadId);
        if (leadIndex === -1) continue;

        const leadToUpdate = updatedLeads[leadIndex];
        if (!leadToUpdate) continue;

        const existingInteractions = leadToUpdate.interactions || [];
        const interactionExists = existingInteractions.some(
          (existing) => existing.loggedAt === loggedAt,
        );

        if (!interactionExists) {
          leadToUpdate.interactions = [
            ...existingInteractions,
            interaction,
          ];
          newInteractionsCount++;
        }
      }

      if (skippedLeads > 0) {
        console.log(`⚠️  Skipped ${skippedLeads} interaction(s) for leads not found in JSON\n`);
      }

      console.log("=== SYNC RESULTS ===\n");
      console.log(`✅ Processed ${updatedEvents.length} LeadUpdated event(s)`);
      console.log(`🆕 Added ${newInteractionsCount} new interaction(s)\n`);

      if (newInteractionsCount > 0) {
        if (options.dryRun) {
          console.log("🔍 DRY RUN: No changes made. Remove --dry-run to apply changes.\n");
        } else {
          // Update JSON file
          const updatedData = {
            leads: updatedLeads,
          };

          fs.writeFileSync(
            leadsJsonPath,
            JSON.stringify(updatedData, null, 2) + "\n",
          );

          console.log(
            `✅ Updated ${leadsJsonPath} with ${newInteractionsCount} new interaction(s)\n`,
          );
        }
      } else {
        console.log("✅ All interactions are already synced. No updates needed.\n");
      }
    } catch (error) {
      console.error("❌ Error syncing leads:", error);
      if (error instanceof Error) {
        console.error("   Message:", error.message);
      }
      process.exit(1);
    }
  });
