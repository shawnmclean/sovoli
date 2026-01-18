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

interface PostHogLeadEvent {
  timestamp: string;
  distinct_id: string;
  properties: {
    type?: string;
    content_category?: string;
    content_name?: string;
    content_type?: string;
    content_ids?: string[];
    value?: number;
    currency?: string;
    cycleId?: string;
    cycleLabel?: string;
    programId?: string;
    programName?: string;
    selection?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    $set?: {
      phone?: string;
      first_name?: string;
      last_name?: string;
      name?: string;
    };
    [key: string]: unknown;
  };
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  programId: string;
  cycleId: string;
  submittedAt: string;
  selection?: string;
  committed?: boolean; // true for Lead events, false for LeadNameEntered
  interactions?: LeadInteraction[];
  // Optional PostHog properties
  type?: string;
  content_category?: string;
  content_name?: string;
  content_type?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  programName?: string;
  cycleLabel?: string;
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
 * Get LeadPhoneEntered events from PostHog for the last 30 days
 * These create/update leads with phone numbers
 */
async function getLeadPhoneEnteredEvents(
  apiKey: string,
  projectId: string,
  programId: string,
): Promise<PostHogLeadEvent[]> {
  const query = `
    SELECT
      timestamp,
      distinct_id,
      properties
    FROM events
    WHERE
      event = 'LeadPhoneEntered'
      AND timestamp >= now() - INTERVAL 30 DAY
      AND (
        properties.programId = '${programId}'
        OR ilike(toString(properties.programId), '%massage%')
      )
    ORDER BY timestamp ASC
  `;

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

  const events: PostHogLeadEvent[] = [];
  const columns = result.columns || ["timestamp", "distinct_id", "properties"];
  const timestampIdx = columns.indexOf("timestamp");
  const distinctIdIdx = columns.indexOf("distinct_id");
  const propertiesIdx = columns.indexOf("properties");

  for (const row of result.results) {
    if (!Array.isArray(row) || row.length < 3) continue;

    const timestamp = String(row[timestampIdx] || row[0] || "");
    const distinctId = String(row[distinctIdIdx] || row[1] || "");
    const propertiesValue = row[propertiesIdx] || row[2];

    let properties: Record<string, unknown>;
    if (typeof propertiesValue === "string") {
      try {
        properties = JSON.parse(propertiesValue);
      } catch {
        continue;
      }
    } else if (typeof propertiesValue === "object" && propertiesValue !== null) {
      properties = propertiesValue as Record<string, unknown>;
    } else {
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
 * Get person properties from PostHog for a distinct_id
 * Uses PostHog's persons API endpoint instead of HogQL for better reliability
 */
async function getPersonProperties(
  apiKey: string,
  projectId: string,
  distinctId: string,
): Promise<PostHogPerson | null> {
  try {
    // Get person properties via persons endpoint using distinct_id filter
    // Using the environments endpoint as per PostHog API documentation
    const response = await fetch(
      `https://us.i.posthog.com/api/environments/${projectId}/persons/?distinct_id=${encodeURIComponent(distinctId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      // If API doesn't support this or person not found, return null
      // Silently fail - we'll try other methods or skip
      return null;
    }

    const data = (await response.json()) as {
      results?: Array<{
        distinct_ids?: string[];
        properties?: Record<string, unknown>;
      }>;
    };

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const person = data.results[0];
    if (!person || !person.properties) {
      return null;
    }

    return {
      distinct_id: distinctId,
      properties: person.properties,
    };
  } catch {
    // If anything fails, just return null - we'll skip person properties lookup
    return null;
  }
}

/**
 * Get LeadNameEntered events from PostHog for the last 30 days
 * These update leads with name information
 */
async function getLeadNameEnteredEvents(
  apiKey: string,
  projectId: string,
  programId: string,
): Promise<PostHogLeadEvent[]> {
  const query = `
    SELECT
      timestamp,
      distinct_id,
      properties
    FROM events
    WHERE
      event = 'LeadNameEntered'
      AND timestamp >= now() - INTERVAL 30 DAY
      AND (
        properties.programId = '${programId}'
        OR ilike(toString(properties.programId), '%massage%')
      )
    ORDER BY timestamp ASC
  `;

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

  const events: PostHogLeadEvent[] = [];
  const columns = result.columns || ["timestamp", "distinct_id", "properties"];
  const timestampIdx = columns.indexOf("timestamp");
  const distinctIdIdx = columns.indexOf("distinct_id");
  const propertiesIdx = columns.indexOf("properties");

  for (const row of result.results) {
    if (!Array.isArray(row) || row.length < 3) continue;

    const timestamp = String(row[timestampIdx] || row[0] || "");
    const distinctId = String(row[distinctIdIdx] || row[1] || "");
    const propertiesValue = row[propertiesIdx] || row[2];

    let properties: Record<string, unknown>;
    if (typeof propertiesValue === "string") {
      try {
        properties = JSON.parse(propertiesValue);
      } catch {
        continue;
      }
    } else if (typeof propertiesValue === "object" && propertiesValue !== null) {
      properties = propertiesValue as Record<string, unknown>;
    } else {
      continue;
    }

    // Only include events that have cycleId and programId
    if (!properties.cycleId || !properties.programId) {
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
 * Get Lead events from PostHog for the last 30 days
 * These mark leads as committed with selection information
 */
async function getLeadEvents(
  apiKey: string,
  projectId: string,
  _tenant: string,
  programId: string,
): Promise<PostHogLeadEvent[]> {
  const query = `
    SELECT
      timestamp,
      distinct_id,
      properties
    FROM events
    WHERE
      event = 'Lead'
      AND timestamp >= now() - INTERVAL 30 DAY
      AND (
        properties.programId = '${programId}'
        OR ilike(toString(properties.programId), '%massage%')
      )
    ORDER BY timestamp ASC
  `;

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

  const events: PostHogLeadEvent[] = [];
  const columns = result.columns || ["timestamp", "distinct_id", "properties"];
  const timestampIdx = columns.indexOf("timestamp");
  const distinctIdIdx = columns.indexOf("distinct_id");
  const propertiesIdx = columns.indexOf("properties");

  for (const row of result.results) {
    if (!Array.isArray(row) || row.length < 3) continue;

    const timestamp = String(row[timestampIdx] || row[0] || "");
    const distinctId = String(row[distinctIdIdx] || row[1] || "");
    const propertiesValue = row[propertiesIdx] || row[2];

    let properties: Record<string, unknown>;
    if (typeof propertiesValue === "string") {
      try {
        properties = JSON.parse(propertiesValue);
      } catch {
        continue;
      }
    } else if (typeof propertiesValue === "object" && propertiesValue !== null) {
      properties = propertiesValue as Record<string, unknown>;
    } else {
      continue;
    }

    // Only include events that have cycleId and programId
    if (!properties.cycleId || !properties.programId) {
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

    // LeadUpdated events should have leadId, but include them even if missing
    // We can match by distinct_id if leadId is missing

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
    .filter((id) => !Number.isNaN(id));

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

    console.log(`📥 Fetching Lead events from PostHog...`);
    console.log(`   Tenant: ${options.tenant}`);
    console.log(`   Program ID: ${options.programId}`);
    console.log(`   Project ID: ${projectId}\n`);

    try {
      // Load existing leads first
      const existingLeadsData = JSON.parse(
        fs.readFileSync(leadsJsonPath, "utf8"),
      ) as { leads: Lead[] };
      const existingLeads = existingLeadsData.leads || [];

      // Create maps of existing leads by distinct_id (or id for backward compatibility)
      // Use distinct_id as the primary identifier
      const leadsByDistinctId = new Map<string, Lead>();
      existingLeads.forEach((lead) => {
        // Support both old lead-N IDs and new distinct_id IDs
        leadsByDistinctId.set(lead.id, lead);
      });

      // Start with all existing leads (will be updated/merged with PostHog data)
      const updatedLeads: Lead[] = [...existingLeads];
      let newLeadsCount = 0;
      let updatedLeadsCount = 0;

      // STEP 1: Process LeadPhoneEntered events - create/update leads with phone
      console.log(`📥 Step 1: Fetching LeadPhoneEntered events...`);
      const phoneEnteredEvents = await getLeadPhoneEnteredEvents(
        apiKey,
        projectId,
        options.programId,
      );
      console.log(`✅ Found ${phoneEnteredEvents.length} LeadPhoneEntered event(s)\n`);

      for (const event of phoneEnteredEvents) {
        const props = event.properties;
        const programId = String(props.programId || "");
        const cycleId = String(props.cycleId || "");
        
        // Get phone from $set.phone (this is where LeadPhoneEntered sets it)
        const phone = String(
          (props.$set && typeof props.$set === "object" && "$set" in props
            ? (props.$set as Record<string, unknown>).phone
            : props.phone) || ""
        );

        if (!phone || !cycleId || !programId) {
          continue;
        }

        // Use distinct_id as the lead ID
        const distinctId = event.distinct_id;
        let lead = leadsByDistinctId.get(distinctId);

        if (!lead) {
          // Create new lead
          lead = {
            id: distinctId, // Use distinct_id as ID
            name: phone, // Temporary name, will be updated by LeadNameEntered
            phone,
            programId,
            cycleId,
            submittedAt: event.timestamp,
            committed: false,
            interactions: [],
          };
          updatedLeads.push(lead);
          leadsByDistinctId.set(distinctId, lead);
          newLeadsCount++;
        } else {
          // Update phone if different
          if (lead.phone !== phone) {
            lead.phone = phone;
          }
          // Update programId and cycleId if provided
          if (programId) lead.programId = programId;
          if (cycleId) lead.cycleId = cycleId;
        }
      }

      // STEP 2: Process LeadNameEntered events - update name
      console.log(`📥 Step 2: Fetching LeadNameEntered events...`);
      const nameEnteredEvents = await getLeadNameEnteredEvents(
        apiKey,
        projectId,
        options.programId,
      );
      console.log(`✅ Found ${nameEnteredEvents.length} LeadNameEntered event(s)\n`);

      for (const event of nameEnteredEvents) {
        const props = event.properties;
        const distinctId = event.distinct_id;
        let lead = leadsByDistinctId.get(distinctId);

        // Get name from $set or properties
        const name =
          String(props.name || props.$set?.name || "") ||
          (props.first_name || props.$set?.first_name || props.last_name || props.$set?.last_name
            ? `${props.first_name || props.$set?.first_name || ""} ${props.last_name || props.$set?.last_name || ""}`.trim()
            : "");

        if (!name) continue;

        if (!lead) {
          // Lead should already exist from LeadPhoneEntered, but create if missing
          const programId = String(props.programId || "");
          const cycleId = String(props.cycleId || "");
          if (!programId || !cycleId) continue;

          lead = {
            id: distinctId,
            name,
            phone: distinctId, // Fallback, should be updated by LeadPhoneEntered
            programId,
            cycleId,
            submittedAt: event.timestamp,
            committed: false,
            interactions: [],
          };
          updatedLeads.push(lead);
          leadsByDistinctId.set(distinctId, lead);
          newLeadsCount++;
        } else {
          // Update name
          if (lead.name !== name) {
            lead.name = name;
            updatedLeadsCount++;
          }
        }
      }

      // STEP 3: Process Lead events - mark as committed and update selection/properties
      console.log(`📥 Step 3: Fetching Lead events...`);
      const leadEvents = await getLeadEvents(
        apiKey,
        projectId,
        options.tenant,
        options.programId,
      );
      console.log(`✅ Found ${leadEvents.length} Lead event(s)\n`);

      for (const event of leadEvents) {
        const props = event.properties;
        const distinctId = event.distinct_id;
        let lead = leadsByDistinctId.get(distinctId);

        // Get name from event properties if not already set
        const name =
          String(props.name || props.$set?.name || "") ||
          (props.first_name || props.$set?.first_name || props.last_name || props.$set?.last_name
            ? `${props.first_name || props.$set?.first_name || ""} ${props.last_name || props.$set?.last_name || ""}`.trim()
            : "");

        const programId = String(props.programId || "");
        const cycleId = String(props.cycleId || "");
        
        if (!programId || !cycleId) continue;

        if (!lead) {
          // Create new lead if missing (shouldn't happen, but handle it)
          lead = {
            id: distinctId,
            name: name || distinctId,
            phone: distinctId, // Should be set by LeadPhoneEntered
            programId,
            cycleId,
            submittedAt: event.timestamp,
            committed: true,
            selection: props.selection as string | undefined,
            type: props.type as string | undefined,
            content_category: props.content_category as string | undefined,
            content_name: props.content_name as string | undefined,
            content_type: props.content_type as string | undefined,
            content_ids: props.content_ids as string[] | undefined,
            value: props.value as number | undefined,
            currency: props.currency as string | undefined,
            programName: props.programName as string | undefined,
            cycleLabel: props.cycleLabel as string | undefined,
            interactions: [],
          };
          updatedLeads.push(lead);
          leadsByDistinctId.set(distinctId, lead);
          newLeadsCount++;
        } else {
          // Update lead properties
          let updated = false;
          
          if (!lead.committed) {
            lead.committed = true;
            updated = true;
          }
          
          if (props.selection && lead.selection !== props.selection) {
            lead.selection = props.selection as string | undefined;
            updated = true;
          }
          
          if (name && lead.name !== name) {
            lead.name = name;
            updated = true;
          }
          
          // Update other optional properties
          if (props.type && !lead.type) lead.type = props.type as string | undefined;
          if (props.content_category && !lead.content_category) lead.content_category = props.content_category as string | undefined;
          if (props.content_name && !lead.content_name) lead.content_name = props.content_name as string | undefined;
          if (props.content_type && !lead.content_type) lead.content_type = props.content_type as string | undefined;
          if (props.content_ids && !lead.content_ids) lead.content_ids = props.content_ids as string[] | undefined;
          if (props.value && !lead.value) lead.value = props.value as number | undefined;
          if (props.currency && !lead.currency) lead.currency = props.currency as string | undefined;
          if (props.programName && !lead.programName) lead.programName = props.programName as string | undefined;
          if (props.cycleLabel && !lead.cycleLabel) lead.cycleLabel = props.cycleLabel as string | undefined;
          
          if (updated) updatedLeadsCount++;
        }
      }

      // Add all existing leads that weren't updated to the list
      for (const [id, lead] of leadsByDistinctId.entries()) {
        if (!updatedLeads.find((l) => l.id === id)) {
          updatedLeads.push(lead);
        }
      }

      if (newLeadsCount > 0 || updatedLeadsCount > 0) {
        console.log(`🆕 Created ${newLeadsCount} new lead(s), updated ${updatedLeadsCount} lead(s)\n`);
      }

      // STEP 4: Process LeadUpdated events (interactions)
      console.log(`📥 Step 4: Fetching LeadUpdated events...`);
      const updatedEvents = await getLeadUpdatedEvents(
        apiKey,
        projectId,
        options.tenant,
        options.programId,
      );
      console.log(`✅ Found ${updatedEvents.length} LeadUpdated event(s)\n`);

      // Process each LeadUpdated event and add interactions to existing leads
      let newInteractionsCount = 0;
      let skippedLeads = 0;

      for (const event of updatedEvents) {
        // Try to match by leadId property first (could be old format "lead-N" or new format distinct_id)
        const leadId = event.properties.leadId as string;
        let lead = leadId ? leadsByDistinctId.get(leadId) : null;
        
        // If not found by leadId, try by distinct_id from the event itself
        // (This might match if staff is tracking interactions and leadId is missing)
        if (!lead) {
          const distinctId = event.distinct_id;
          lead = leadsByDistinctId.get(distinctId);
        }
        
        if (!lead) {
          // Can't match this interaction to a lead - skip it
          // (This happens if leadId is old format and we're rebuilding with new format)
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

        // Find the lead in updatedLeads array
        const leadIndex = updatedLeads.findIndex((l) => l.id === lead.id);
        if (leadIndex === -1) continue;

        const leadToUpdate = updatedLeads[leadIndex];
        if (!leadToUpdate) continue;

        const existingInteractions = leadToUpdate.interactions || [];
        // Check for duplicates by comparing timestamps within 2 seconds and same interaction data
        const interactionExists = existingInteractions.some((existing) => {
          const existingTime = new Date(existing.loggedAt).getTime();
          const newTime = new Date(loggedAt).getTime();
          const timeDiff = Math.abs(newTime - existingTime);
          
          // Same timestamp (within 2 seconds) and same interaction data
          if (timeDiff <= 2000) {
            // Compare interaction data (excluding loggedAt)
            const existingData = JSON.stringify({
              contactOutcome: existing.contactOutcome,
              notReachedReason: existing.notReachedReason,
              interestLevel: existing.interestLevel,
              blocker: existing.blocker,
              nextAction: existing.nextAction,
              notes: existing.notes,
            });
            const newData = JSON.stringify({
              contactOutcome: interaction.contactOutcome,
              notReachedReason: interaction.notReachedReason,
              interestLevel: interaction.interestLevel,
              blocker: interaction.blocker,
              nextAction: interaction.nextAction,
              notes: interaction.notes,
            });
            return existingData === newData;
          }
          return false;
        });

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

      // STEP 5: Migrate leads from old IDs (lead-N) to new distinct_id format
      console.log(`🔄 Step 5: Migrating leads to use distinct_id as ID...`);
      
      // Build a map of phone -> distinct_id from PostHog events
      const phoneToDistinctId = new Map<string, string>();
      for (const event of phoneEnteredEvents) {
        const props = event.properties;
        const phone = String(
          (props.$set && typeof props.$set === "object" && "$set" in props
            ? (props.$set as Record<string, unknown>).phone
            : props.phone) || ""
        );
        if (phone) {
          phoneToDistinctId.set(phone, event.distinct_id);
        }
      }

      // Migrate leads: update ID from old format to distinct_id and merge duplicates
      let migratedCount = 0;
      const leadsToRemove: number[] = [];
      const seenDistinctIds = new Set<string>();
      
      for (let i = 0; i < updatedLeads.length; i++) {
        const lead = updatedLeads[i];
        if (!lead) continue;
        
        // Check if lead has old format ID (lead-N) and we can find its distinct_id
        if (lead.id.startsWith("lead-") && lead.phone) {
          const distinctId = phoneToDistinctId.get(lead.phone);
          if (distinctId) {
            // Check if we already have a lead with this distinct_id
            const existingLeadIndex = updatedLeads.findIndex((l) => l && l.id === distinctId);
            
            if (existingLeadIndex !== -1 && existingLeadIndex !== i) {
              // Merge interactions from old lead into existing lead
              const existingLead = updatedLeads[existingLeadIndex];
              if (existingLead && lead.interactions) {
                const existingInteractions = existingLead.interactions || [];
                const mergedInteractions = [...existingInteractions];
                
                // Add interactions from old lead that don't already exist
                for (const interaction of lead.interactions) {
                  const exists = existingInteractions.some(
                    (existing) => existing.loggedAt === interaction.loggedAt,
                  );
                  if (!exists) {
                    mergedInteractions.push(interaction);
                  }
                }
                
                // Sort by loggedAt (newest first)
                mergedInteractions.sort(
                  (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
                );
                
                existingLead.interactions = mergedInteractions;
              }
              
              // Mark old lead for removal
              leadsToRemove.push(i);
            } else {
              // No duplicate, just update the ID
              const oldId = lead.id;
              lead.id = distinctId;
              migratedCount++;
              
              // Update the map
              leadsByDistinctId.delete(oldId);
              leadsByDistinctId.set(distinctId, lead);
            }
          }
        }
        
        // Track distinct_id to remove duplicates
        if (lead.id && !lead.id.startsWith("lead-")) {
          if (seenDistinctIds.has(lead.id)) {
            // Found duplicate - keep the first one, mark this for removal
            leadsToRemove.push(i);
          } else {
            seenDistinctIds.add(lead.id);
          }
        }
      }
      
      // Remove duplicates (in reverse order to maintain indices)
      leadsToRemove.sort((a, b) => b - a);
      for (const index of leadsToRemove) {
        const lead = updatedLeads[index];
        if (lead) {
          updatedLeads.splice(index, 1);
        }
      }

      if (migratedCount > 0 || leadsToRemove.length > 0) {
        console.log(`✅ Migrated ${migratedCount} lead(s) from old IDs to distinct_id format`);
        if (leadsToRemove.length > 0) {
          console.log(`   Removed ${leadsToRemove.length} duplicate lead(s)\n`);
        } else {
          console.log();
        }
      } else {
        console.log(`✅ All leads already use distinct_id format\n`);
      }

      console.log("=== SYNC RESULTS ===\n");
      console.log(`✅ Processed ${phoneEnteredEvents.length} LeadPhoneEntered event(s)`);
      console.log(`✅ Processed ${nameEnteredEvents.length} LeadNameEntered event(s)`);
      console.log(`✅ Processed ${leadEvents.length} Lead event(s)`);
      console.log(`✅ Processed ${updatedEvents.length} LeadUpdated event(s)`);
      console.log(`🆕 Created ${newLeadsCount} new lead(s)`);
      console.log(`🔄 Updated ${updatedLeadsCount} existing lead(s)`);
      console.log(`🆕 Added ${newInteractionsCount} new interaction(s)\n`);

      const hasChanges = newLeadsCount > 0 || newInteractionsCount > 0 || migratedCount > 0 || (leadsToRemove.length > 0);

      if (hasChanges) {
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

          const changes: string[] = [];
          if (newLeadsCount > 0) {
            changes.push(`${newLeadsCount} new lead(s)`);
          }
          if (newInteractionsCount > 0) {
            changes.push(`${newInteractionsCount} new interaction(s)`);
          }
          if (migratedCount > 0) {
            changes.push(`${migratedCount} migrated lead(s)`);
          }

          console.log(
            `✅ Updated ${leadsJsonPath} with ${changes.join(" and ")}\n`,
          );
        }
      } else {
        console.log("✅ All leads and interactions are already synced. No updates needed.\n");
      }
    } catch (error) {
      console.error("❌ Error syncing leads:", error);
      if (error instanceof Error) {
        console.error("   Message:", error.message);
      }
      process.exit(1);
    }
  });
