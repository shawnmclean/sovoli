#!/usr/bin/env node
/**
 * Extract PostHog LeadUpdated events from query results
 *
 * Usage:
 *   node scripts/leads/extract-posthog-events.js [posthog-results-file]
 *
 * If no file is provided, it will look for the most recent PostHog query result
 * in the agent-tools directory.
 *
 * Output: posthog-events-parsed.json
 */

const fs = require("fs");
const path = require("path");

// Get input file from command line or use default
const inputFile = process.argv[2] || findLatestPostHogFile();

if (!inputFile || !fs.existsSync(inputFile)) {
  console.error("❌ Error: PostHog results file not found");
  console.error(
    "Usage: node scripts/leads/extract-posthog-events.js <posthog-results-file>",
  );
  process.exit(1);
}

console.log(`📄 Reading PostHog results from: ${inputFile}`);

const content = fs.readFileSync(inputFile, "utf8");
const lines = content.split("\n");
const events = [];

lines.forEach((line, i) => {
  // Only process lines that contain leadId
  if (!line.includes("leadId")) return;

  // Extract timestamp - it's the first quoted ISO date string
  const timestampMatch = line.match(/"(\d{4}-\d{2}-\d{2}T[\d:\.]+Z)"/);
  if (!timestampMatch) {
    console.error(`Line ${i}: No timestamp found`);
    return;
  }

  const timestamp = timestampMatch[1];

  // Find where the JSON starts: after the comma and quote after timestamp
  // Format: "timestamp","{json}"
  const jsonStartIdx = line.indexOf('","') + 3;
  if (jsonStartIdx < 3) {
    console.error(`Line ${i}: Invalid JSON start index`);
    return;
  }

  // Extract JSON string - it goes from jsonStartIdx to the end, minus trailing quote
  let jsonStr = line.substring(jsonStartIdx);

  // Remove trailing quote if the line ends with a quote
  if (jsonStr.endsWith('"')) {
    jsonStr = jsonStr.slice(0, -1);
  }

  // Parse the JSON
  try {
    const properties = JSON.parse(jsonStr);

    // Extract only the relevant fields
    const event = {
      timestamp,
      leadId: properties.leadId,
      contactOutcome: properties.contactOutcome,
      notReachedReason: properties.notReachedReason,
      interestLevel: properties.interestLevel,
      blocker: properties.blocker,
      nextAction: properties.nextAction,
      notes: properties.notes,
      loggedAt: properties.loggedAt,
      tenant: properties.tenant,
      cycleId: properties.cycleId,
      programId: properties.programId,
      programName: properties.programName,
      cycleLabel: properties.cycleLabel,
    };

    // Only add if it has a leadId (some events might not)
    if (event.leadId) {
      events.push(event);
    }
  } catch (e) {
    console.error(`Error parsing JSON on line ${i}:`, e.message);
  }
});

// Write parsed events to a JSON file
const outputFile = "posthog-events-parsed.json";
fs.writeFileSync(outputFile, JSON.stringify(events, null, 2));
console.log(`✅ Successfully parsed ${events.length} events from PostHog`);
console.log(`📝 Saved to: ${outputFile}`);
console.log(`\nEvent summary:`);
events.slice(0, 10).forEach((e, i) => {
  console.log(`  ${i + 1}. ${e.leadId} - ${e.loggedAt} - ${e.contactOutcome}`);
});
if (events.length > 10) {
  console.log(`  ... and ${events.length - 10} more`);
}

function findLatestPostHogFile() {
  // Try to find the most recent PostHog query result in agent-tools
  const agentToolsPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    ".cursor",
    "projects",
    "e-Developers-sovoli",
    "agent-tools",
  );
  if (!fs.existsSync(agentToolsPath)) {
    return null;
  }

  const files = fs
    .readdirSync(agentToolsPath)
    .filter((f) => f.endsWith(".txt"))
    .map((f) => ({
      name: f,
      path: path.join(agentToolsPath, f),
      mtime: fs.statSync(path.join(agentToolsPath, f)).mtime,
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0].path : null;
}
