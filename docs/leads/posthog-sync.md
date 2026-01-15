# PostHog Lead Data Sync

This guide explains how to sync lead interaction data from PostHog to the JSON file to ensure data accuracy and completeness.

## Overview

Lead interactions are logged to PostHog via the `LeadInteractionModal` component. This process validates that all PostHog events are correctly reflected in the JSON file and identifies any discrepancies.

## Quick Start

```bash
# 1. Query PostHog for events (see Step 1 below)
# 2. Extract events to JSON
node scripts/leads/extract-posthog-events.js <posthog-results-file>

# 3. Compare with JSON file
node scripts/leads/compare-posthog-json.js

# 4. Review the report and update JSON file manually based on findings
```

## Detailed Process

### Step 1: Query PostHog

Use the PostHog MCP tool to query "LeadUpdated" events:

**Query Parameters:**
- Event: `LeadUpdated`
- Tenant: `healingemeraldwellness` (or your target tenant)
- Date Range: Last 30 days (or custom range)
- Properties Filter: `tenant = "healingemeraldwellness"`

**Example MCP Query:**
```json
{
  "query": {
    "kind": "DataVisualizationNode",
    "source": {
      "kind": "HogQLQuery",
      "query": "SELECT timestamp, properties FROM events WHERE event = 'LeadUpdated' AND JSONExtractString(properties, 'tenant') = 'healingemeraldwellness' AND timestamp >= '2025-12-16' ORDER BY timestamp DESC LIMIT 100",
      "filters": {
        "dateRange": {
          "date_from": "2025-12-16",
          "date_to": null,
          "explicitDate": true
        },
        "filterTestAccounts": false
      }
    }
  }
}
```

**Save Results:**
The query results will be saved to a temporary file. Note the file path for the next step.

### Step 2: Extract Events

Run the extraction script to parse PostHog query results:

```bash
node scripts/leads/extract-posthog-events.js <path-to-posthog-results.txt>
```

This script:
- Parses the PostHog query results file
- Extracts relevant event properties
- Saves to `posthog-events-parsed.json`

**Output:** `posthog-events-parsed.json` with structured event data.

### Step 3: Compare with JSON

Run the comparison script:

```bash
node scripts/leads/compare-posthog-json.js
```

This script:
- Loads PostHog events from `posthog-events-parsed.json`
- Loads leads from the JSON file
- Matches interactions by `leadId` and `loggedAt` timestamp
- Identifies missing interactions and discrepancies
- Generates a comparison report

**Output:**
- Console report with findings
- `posthog-json-comparison-report.json` with detailed data

### Step 4: Update JSON File

Based on the comparison report, update the JSON file:

1. **Missing Interactions:** Add new interactions to the appropriate lead's `interactions` array
2. **Discrepancies:** Fix field mismatches (e.g., trailing spaces in notes)
3. **Contact Info:** Verify and update lead contact information if needed

**File Location:**
```
apps/sovoli.com/src/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json
```

## Scripts Reference

### `extract-posthog-events.js`

Extracts and parses PostHog query results.

**Usage:**
```bash
node scripts/leads/extract-posthog-events.js [posthog-results-file]
```

**Input:** PostHog query results file (text format)
**Output:** `posthog-events-parsed.json`

**What it does:**
- Parses PostHog query result format
- Extracts event properties: `leadId`, `contactOutcome`, `interestLevel`, `blocker`, `nextAction`, `notes`, `loggedAt`, etc.
- Normalizes timestamps

### `compare-posthog-json.js`

Compares PostHog events with JSON file.

**Usage:**
```bash
node scripts/leads/compare-posthog-json.js
```

**Input:** 
- `posthog-events-parsed.json` (from extraction script)
- `apps/sovoli.com/src/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json`

**Output:**
- Console report
- `posthog-json-comparison-report.json`

**What it does:**
- Matches PostHog events to JSON interactions
- Identifies missing interactions
- Detects data discrepancies
- Verifies contact information
- Analyzes schema differences

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

1. **Scheduled Job:** Run comparison script daily/weekly
2. **CI/CD Integration:** Validate data on deployment
3. **Webhook:** Real-time sync from PostHog (if available)

## Related Files

- **Event Source:** `apps/sovoli.com/src/app/[username]/dashboard/components/LeadInteractionModal.tsx`
- **JSON Schema:** `apps/sovoli.com/src/modules/data/organisations/utils/parseLeadsModule.ts`
- **Report Page:** `apps/sovoli.com/src/app/[username]/dashboard/programs/[slug]/leads/report/page.tsx`
