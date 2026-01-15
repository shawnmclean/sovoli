/**
 * Lead selection type - what action the user selected
 */
export type LeadSelection = "enroll" | "visit" | "more_information";

/**
 * Lead interaction from CRM logging
 */
export interface LeadInteraction {
  loggedAt: string;
  contactOutcome: "not_reached" | "brief_contact" | "conversation";
  notReachedReason?: "try_again_later" | "invalid_number";
  interestLevel?: "not_interested" | "curious" | "unsure" | "wants_to_proceed";
  blocker?:
    | "different_program"
    | "timing"
    | "needs_time"
    | "needs_approval"
    | "needs_visit"
    | "price_uncertainty"
    | "comparing"
    | "not_serious";
  nextAction?:
    | "follow_up_later"
    | "visit_scheduled"
    | "waiting_on_them"
    | "no_followup";
  notes?: string;
}

/**
 * Lead from PostHog "Lead" event for program enrollment
 * Contains all properties sent in the PostHog event
 */
export interface Lead {
  /** Unique identifier for the lead */
  id: string;
  /** Lead's full name (may be phone number if name not available) */
  name: string;
  /** Lead's phone number */
  phone: string;
  /** Program cycle ID */
  cycleId: string;
  /** ISO timestamp when the lead was submitted */
  submittedAt: string;

  // PostHog event properties (optional, will be populated from PostHog)
  /** Event type - always "program" for program leads */
  type?: "program";
  /** Program group/category name */
  content_category?: string;
  /** Content name: "{programName} - {cycleLabel}" */
  content_name?: string;
  /** Content type - always "product" */
  content_type?: "product";
  /** Array containing cycle ID */
  content_ids?: string[];
  /** Primary pricing amount */
  value?: number;
  /** Primary currency code */
  currency?: string;
  /** Program ID */
  programId?: string;
  /** Program name */
  programName?: string;
  /** Cycle label (formatted) */
  cycleLabel?: string;
  /** User's selection: enroll, visit, or more_information */
  selection?: LeadSelection;
  /** Array of interactions logged for this lead */
  interactions?: LeadInteraction[];
}

/**
 * Container for embedding in org instance
 */
export interface LeadsModule {
  leads: Lead[];
}
