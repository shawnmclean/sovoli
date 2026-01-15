import { z } from "zod";
import type { LeadsModule, Lead, LeadSelection } from "~/modules/leads/types";

/**
 * Zod schema for LeadSelection enum
 */
const leadSelectionSchema = z.enum(["enroll", "visit", "more_information"]);

/**
 * Zod schema for a lead interaction
 */
const leadInteractionSchema = z.object({
  loggedAt: z.string(),
  contactOutcome: z.enum(["not_reached", "brief_contact", "conversation"]),
  notReachedReason: z.enum(["try_again_later", "invalid_number"]).optional(),
  interestLevel: z.enum(["not_interested", "curious", "unsure", "wants_to_proceed"]).optional(),
  blocker: z.enum([
    "different_program",
    "timing",
    "needs_time",
    "needs_approval",
    "needs_visit",
    "price_uncertainty",
    "comparing",
    "not_serious",
  ]).optional(),
  nextAction: z.enum([
    "follow_up_later",
    "visit_scheduled",
    "waiting_on_them",
    "no_followup",
  ]).optional(),
  notes: z.string().optional(),
});

/**
 * Zod schema for JSON representation of a lead
 */
const leadJsonSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  phone: z.string(),
  cycleId: z.string(),
  submittedAt: z.string(),

  // Optional PostHog event properties
  type: z.literal("program").optional(),
  content_category: z.string().optional(),
  content_name: z.string().optional(),
  content_type: z.literal("product").optional(),
  content_ids: z.array(z.string()).optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  programId: z.string().optional(),
  programName: z.string().optional(),
  cycleLabel: z.string().optional(),
  selection: leadSelectionSchema.optional(),

  // Interactions array
  interactions: z.array(leadInteractionSchema).optional(),
});

/**
 * Zod schema for the leads JSON file structure
 */
const leadsModuleJsonSchema = z.object({
  leads: z.array(leadJsonSchema),
});

/**
 * Parses a leads.json file and returns a fully hydrated LeadsModule.
 *
 * @param jsonData - The parsed JSON data from the leads.json file
 * @returns Fully hydrated LeadsModule
 * @throws Error if JSON structure is invalid
 */
export function parseLeadsModule(jsonData: unknown): LeadsModule {
  // Validate JSON structure
  const validated = leadsModuleJsonSchema.parse(jsonData);

  // Convert JSON data to Lead objects
  const leads: Lead[] = validated.leads.map((leadJson) => {
    // Use phone number as fallback name if name is not provided
    const name = leadJson.name ?? leadJson.phone;
    
    const lead: Lead = {
      id: leadJson.id,
      name,
      phone: leadJson.phone,
      cycleId: leadJson.cycleId,
      submittedAt: leadJson.submittedAt,
      // Optional PostHog properties
      type: leadJson.type,
      content_category: leadJson.content_category,
      content_name: leadJson.content_name,
      content_type: leadJson.content_type,
      content_ids: leadJson.content_ids,
      value: leadJson.value,
      currency: leadJson.currency,
      programId: leadJson.programId,
      programName: leadJson.programName,
      cycleLabel: leadJson.cycleLabel,
      selection: leadJson.selection,
      // Interactions from JSON
      interactions: leadJson.interactions,
    };

    return lead;
  });

  return {
    leads,
  };
}
