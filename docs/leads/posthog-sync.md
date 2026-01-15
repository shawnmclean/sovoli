# PostHog Lead Data Sync

This guide explains how to sync lead interaction data from PostHog to the JSON file using the CLI.

## Overview

- **LeadUpdated Events**: Tracked when staff log interactions with leads via the `LeadInteractionModal` component
- **Lead Data**: Lead information (name, phone, program, cycle) is already stored in the JSON file from previous syncs
- **Interaction Data**: The CLI syncs new interactions from `LeadUpdated` events and adds them to existing leads

This process ensures that all PostHog interaction events are correctly reflected in the JSON file.

## Quick Start

Use the CLI command to automatically sync lead interactions from PostHog:

```bash
# Set environment variables in .env file:
# POSTHOG_API_KEY=your_personal_api_key_here
# POSTHOG_PROJECT_ID=your_project_id_here

# Sync interactions for a tenant and program
pnpm cli sync-posthog-leads --tenant healingemeraldwellness --program-id hew-massage-therapy

# Dry run to see what would be updated
pnpm cli sync-posthog-leads --tenant healingemeraldwellness --program-id hew-massage-therapy --dry-run
```

**What it does:**
- Queries PostHog for "LeadUpdated" events from the last 30 days
- Matches events to existing leads in the JSON file by `leadId`
- Adds new interactions to the appropriate lead's `interactions` array
- Skips interactions that already exist (matched by `loggedAt` timestamp)

## Using the CLI

The CLI command automatically syncs lead interactions from PostHog:

```bash
pnpm cli sync-posthog-leads --tenant <tenant> --program-id <programId>
```

**Required Environment Variables:**
- `POSTHOG_API_KEY`: Your PostHog personal API key (with `query:read` scope)
- `POSTHOG_PROJECT_ID`: Your PostHog project ID

**Options:**
- `--tenant <tenant>`: Tenant username (e.g., `healingemeraldwellness`)
- `--program-id <programId>`: Program ID (e.g., `hew-massage-therapy`)
- `--project-id <projectId>`: Override PostHog project ID (optional, uses env var by default)
- `--dry-run`: Show what would be updated without making changes

**Example:**
```bash
pnpm cli sync-posthog-leads --tenant healingemeraldwellness --program-id hew-massage-therapy
```

The command will:
1. Load existing leads from the JSON file
2. Query PostHog for "LeadUpdated" events from the last 30 days matching the tenant and program
3. Match events to existing leads by `leadId`
4. Add new interactions to the appropriate lead's `interactions` array
5. Skip interactions that already exist (matched by `loggedAt` timestamp)
6. Update the JSON file automatically (or show what would be updated with `--dry-run`)

**File Location:**
```
apps/sovoli.com/src/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json
```

## Data Matching

Interactions are matched using:
- **Lead ID:** `leadId` from PostHog matches `id` in JSON
- **Timestamp:** `loggedAt` with 5-second tolerance to account for timing differences

## Common Issues

### Trailing Spaces in Notes

PostHog may preserve trailing spaces that get trimmed in JSON. Options:
1. **Match PostHog exactly:** Add trailing spaces to JSON
2. **Normalize:** Trim whitespace in both sources (recommended)

### Missing Interactions

If interactions exist in PostHog but not JSON:
1. Verify the interaction wasn't logged after the JSON was last updated
2. Add the interaction to the lead's `interactions` array
3. Ensure `loggedAt` timestamp matches PostHog

### Timestamp Mismatches

If timestamps don't match:
- Check timezone handling (both should be UTC)
- Verify millisecond precision
- Use 5-second tolerance for matching

## Schema Reference

### PostHog Event Properties

```typescript
{
  leadId: string;
  contactOutcome: "not_reached" | "brief_contact" | "conversation";
  notReachedReason?: "try_again_later" | "invalid_number";
  interestLevel?: "not_interested" | "curious" | "unsure" | "wants_to_proceed";
  blocker?: "different_program" | "timing" | "needs_time" | "needs_approval" | "needs_visit" | "price_uncertainty" | "comparing" | "not_serious";
  nextAction?: "follow_up_later" | "visit_scheduled" | "waiting_on_them" | "no_followup";
  notes?: string;
  loggedAt: string; // ISO 8601
  tenant: string;
  cycleId: string;
  programId: string;
  programName: string;
  cycleLabel: string;
}
```

### JSON Interaction Schema

```typescript
{
  loggedAt: string; // ISO 8601
  contactOutcome: "not_reached" | "brief_contact" | "conversation";
  notReachedReason?: "try_again_later" | "invalid_number";
  interestLevel?: "not_interested" | "curious" | "unsure" | "wants_to_proceed";
  blocker?: "different_program" | "timing" | "needs_time" | "needs_approval" | "needs_visit" | "price_uncertainty" | "comparing" | "not_serious";
  nextAction?: "follow_up_later" | "visit_scheduled" | "waiting_on_them" | "no_followup";
  notes?: string;
}
```

## Automation

For regular syncing, consider:

1. **Scheduled Job:** Run the CLI command daily/weekly
2. **CI/CD Integration:** Validate data on deployment
3. **Webhook:** Real-time sync from PostHog (if available)

## Related Files

- **Event Source:** `apps/sovoli.com/src/app/[username]/dashboard/components/LeadInteractionModal.tsx`
- **JSON Schema:** `apps/sovoli.com/src/modules/data/organisations/utils/parseLeadsModule.ts`
- **Report Page:** `apps/sovoli.com/src/app/[username]/dashboard/programs/[slug]/leads/report/page.tsx`
