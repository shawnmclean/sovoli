#!/usr/bin/env node
/**
 * Compare PostHog LeadUpdated events with JSON file
 *
 * Usage:
 *   node scripts/leads/compare-posthog-json.js
 *
 * This script:
 * - Loads PostHog events from posthog-events-parsed.json
 * - Loads leads from the JSON file
 * - Matches interactions and identifies discrepancies
 * - Generates a comparison report
 *
 * Output: posthog-json-comparison-report.json
 */

const fs = require("fs");
const path = require("path");

// Configuration
const JSON_FILE =
  "apps/sovoli.com/src/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json";
const POSTHOG_EVENTS_FILE = "posthog-events-parsed.json";

// Load JSON file
if (!fs.existsSync(JSON_FILE)) {
  console.error(`❌ Error: JSON file not found: ${JSON_FILE}`);
  process.exit(1);
}

const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));

// Try to load parsed events
let posthogEvents = [];
if (fs.existsSync(POSTHOG_EVENTS_FILE)) {
  try {
    posthogEvents = JSON.parse(fs.readFileSync(POSTHOG_EVENTS_FILE, "utf8"));
    console.log(
      `✅ Loaded ${posthogEvents.length} events from ${POSTHOG_EVENTS_FILE}\n`,
    );
  } catch (e) {
    console.error(`❌ Error reading ${POSTHOG_EVENTS_FILE}:`, e.message);
    process.exit(1);
  }
} else {
  console.error(`❌ Error: ${POSTHOG_EVENTS_FILE} not found`);
  console.error(
    "   Run extract-posthog-events.js first to generate this file.",
  );
  process.exit(1);
}

console.log("=== PostHog vs JSON Comparison Report ===\n");
console.log(`PostHog Events Found: ${posthogEvents.length}`);
console.log(`JSON Leads: ${jsonData.leads.length}\n`);

// Compare PostHog events with JSON
const missingInteractions = [];
const matchedInteractions = [];
const discrepancies = [];

posthogEvents.forEach((phEvent) => {
  // Normalize loggedAt for comparison (remove milliseconds, handle timezone)
  const phLoggedAt = new Date(phEvent.loggedAt)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");

  // Try to find matching interaction in JSON
  let found = false;
  const lead = jsonData.leads.find((l) => l.id === phEvent.leadId);

  if (lead && lead.interactions) {
    for (const jsonInteraction of lead.interactions) {
      const jsonLoggedAt = new Date(jsonInteraction.loggedAt)
        .toISOString()
        .replace(/\.\d{3}Z$/, "Z");

      // Compare timestamps with 5 second tolerance
      const timeDiff = Math.abs(new Date(phLoggedAt) - new Date(jsonLoggedAt));
      if (timeDiff < 5000) {
        found = true;
        matchedInteractions.push({ phEvent, jsonInteraction, lead });

        // Check for discrepancies
        const differences = [];
        if (phEvent.contactOutcome !== jsonInteraction.contactOutcome) {
          differences.push(
            `contactOutcome: PostHog="${phEvent.contactOutcome}", JSON="${jsonInteraction.contactOutcome}"`,
          );
        }
        if (phEvent.notReachedReason !== jsonInteraction.notReachedReason) {
          differences.push(
            `notReachedReason: PostHog="${phEvent.notReachedReason}", JSON="${jsonInteraction.notReachedReason}"`,
          );
        }
        if (phEvent.interestLevel !== jsonInteraction.interestLevel) {
          differences.push(
            `interestLevel: PostHog="${phEvent.interestLevel}", JSON="${jsonInteraction.interestLevel}"`,
          );
        }
        if (phEvent.blocker !== jsonInteraction.blocker) {
          differences.push(
            `blocker: PostHog="${phEvent.blocker}", JSON="${jsonInteraction.blocker}"`,
          );
        }
        if (phEvent.nextAction !== jsonInteraction.nextAction) {
          differences.push(
            `nextAction: PostHog="${phEvent.nextAction}", JSON="${jsonInteraction.nextAction}"`,
          );
        }
        if (phEvent.notes !== jsonInteraction.notes) {
          differences.push(
            `notes: PostHog="${phEvent.notes}", JSON="${jsonInteraction.notes}"`,
          );
        }

        if (differences.length > 0) {
          discrepancies.push({
            leadId: phEvent.leadId,
            loggedAt: phEvent.loggedAt,
            differences,
          });
        }
        break;
      }
    }
  }

  if (!found) {
    missingInteractions.push({ phEvent, lead });
  }
});

// Generate report
console.log("=== FINDINGS ===\n");

console.log(`✅ Matched Interactions: ${matchedInteractions.length}`);
console.log(
  `❌ Missing Interactions (in PostHog but not in JSON): ${missingInteractions.length}`,
);
console.log(`⚠️  Data Discrepancies: ${discrepancies.length}\n`);

if (missingInteractions.length > 0) {
  console.log("=== MISSING INTERACTIONS ===");
  missingInteractions.forEach(({ phEvent, lead }) => {
    console.log(`\nLead: ${lead?.name || phEvent.leadId} (${phEvent.leadId})`);
    console.log(`  LoggedAt: ${phEvent.loggedAt}`);
    console.log(`  Contact Outcome: ${phEvent.contactOutcome}`);
    if (phEvent.interestLevel)
      console.log(`  Interest Level: ${phEvent.interestLevel}`);
    if (phEvent.blocker) console.log(`  Blocker: ${phEvent.blocker}`);
    if (phEvent.notes) console.log(`  Notes: ${phEvent.notes}`);
    console.log(`  → This interaction needs to be added to JSON`);
  });
  console.log("\n");
}

if (discrepancies.length > 0) {
  console.log("=== DATA DISCREPANCIES ===");
  discrepancies.forEach((d) => {
    console.log(`\nLead: ${d.leadId}, LoggedAt: ${d.loggedAt}`);
    d.differences.forEach((diff) => console.log(`  - ${diff}`));
  });
  console.log("\n");
}

// Schema analysis
console.log("=== SCHEMA ANALYSIS ===\n");

const posthogFields = new Set();
const jsonFields = new Set();

posthogEvents.forEach((e) => {
  Object.keys(e).forEach((k) => posthogFields.add(k));
});

jsonData.leads.forEach((lead) => {
  if (lead.interactions) {
    lead.interactions.forEach((i) => {
      Object.keys(i).forEach((k) => jsonFields.add(k));
    });
  }
});

const fieldsInPostHogNotInJSON = [...posthogFields].filter(
  (f) => !jsonFields.has(f) && f !== "timestamp" && f !== "tenant",
);
const fieldsInJSONNotInPostHog = [...jsonFields].filter(
  (f) => !posthogFields.has(f),
);

console.log("Fields in PostHog but not in JSON schema:");
if (fieldsInPostHogNotInJSON.length > 0) {
  fieldsInPostHogNotInJSON.forEach((f) => console.log(`  - ${f}`));
} else {
  console.log("  (none)");
}

console.log("\nFields in JSON but not in PostHog:");
if (fieldsInJSONNotInPostHog.length > 0) {
  fieldsInJSONNotInPostHog.forEach((f) => console.log(`  - ${f}`));
} else {
  console.log("  (none)");
}

// Contact information verification
console.log("\n=== CONTACT INFORMATION VERIFICATION ===\n");

posthogEvents.forEach((phEvent) => {
  const lead = jsonData.leads.find((l) => l.id === phEvent.leadId);
  if (lead) {
    console.log(
      `✅ Lead ${phEvent.leadId}: Found in JSON (${lead.name}, ${lead.phone})`,
    );
  } else {
    console.log(
      `❌ Lead ${phEvent.leadId}: NOT FOUND in JSON - NEW LEAD DETECTED`,
    );
  }
});

// Generate recommendations
console.log("\n=== RECOMMENDATIONS ===\n");

const recommendations = [];

if (missingInteractions.length > 0) {
  recommendations.push({
    priority: "HIGH",
    issue: "Missing interactions in JSON",
    count: missingInteractions.length,
    action: `Add ${missingInteractions.length} missing interaction(s) to the JSON file`,
  });
}

if (discrepancies.length > 0) {
  recommendations.push({
    priority: "MEDIUM",
    issue: "Data discrepancies between PostHog and JSON",
    count: discrepancies.length,
    action: "Review and update JSON interactions to match PostHog data",
  });
}

if (fieldsInPostHogNotInJSON.length > 0) {
  recommendations.push({
    priority: "LOW",
    issue: "Additional context fields in PostHog",
    count: fieldsInPostHogNotInJSON.length,
    action: `Consider adding these fields to JSON schema: ${fieldsInPostHogNotInJSON.join(", ")}`,
  });
}

if (recommendations.length === 0) {
  console.log("✅ No issues found! Data is in sync.\n");
} else {
  recommendations.forEach((rec, i) => {
    console.log(
      `${i + 1}. [${rec.priority}] ${rec.issue} (${rec.count} occurrence(s))`,
    );
    console.log(`   Action: ${rec.action}\n`);
  });
}

// Save detailed report
const report = {
  summary: {
    posthogEventsCount: posthogEvents.length,
    jsonLeadsCount: jsonData.leads.length,
    matchedInteractions: matchedInteractions.length,
    missingInteractions: missingInteractions.length,
    discrepancies: discrepancies.length,
  },
  missingInteractions: missingInteractions.map(({ phEvent, lead }) => ({
    leadId: phEvent.leadId,
    leadName: lead?.name,
    loggedAt: phEvent.loggedAt,
    contactOutcome: phEvent.contactOutcome,
    notReachedReason: phEvent.notReachedReason,
    interestLevel: phEvent.interestLevel,
    blocker: phEvent.blocker,
    nextAction: phEvent.nextAction,
    notes: phEvent.notes,
  })),
  discrepancies,
  recommendations,
};

const reportFile = "posthog-json-comparison-report.json";
fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
console.log(`✅ Detailed report saved to: ${reportFile}`);
