/**
 * Display diffs for org and program changes
 */

/**
 * Format a value for display
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "(empty)";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return `[${value.length} item${value.length === 1 ? "" : "s"}]`;
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

/**
 * Display diff for a single field
 */
function displayFieldDiff(
  fieldName: string,
  oldValue: unknown,
  newValue: unknown,
  indent = 0,
): void {
  const prefix = "  ".repeat(indent);
  const oldFormatted = formatValue(oldValue);
  const newFormatted = formatValue(newValue);

  if (oldValue === undefined || oldValue === null) {
    console.log(`${prefix}${fieldName}:`);
    console.log(`${prefix}  + ${newFormatted}`);
  } else if (newValue === undefined || newValue === null) {
    console.log(`${prefix}${fieldName}:`);
    console.log(`${prefix}  - ${oldFormatted}`);
  } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
    console.log(`${prefix}${fieldName}:`);
    console.log(`${prefix}  - ${oldFormatted}`);
    console.log(`${prefix}  + ${newFormatted}`);
  }
}

/**
 * Display org changes diff
 */
export function displayOrgDiff(
  oldOrg: Record<string, unknown>,
  newOrg: Record<string, unknown>,
): void {
  console.log("\n📊 Organization Changes:");
  console.log("=".repeat(50));

  // Check contacts (in locations)
  if (newOrg.locations) {
    const newLocations = newOrg.locations as Array<{
      contacts?: unknown[];
    }>;
    const oldLocations =
      (oldOrg.locations as Array<{
        contacts?: unknown[];
      }>) || [];

    if (newLocations.length > 0) {
      const newFirstLocation = newLocations[0];
      const oldFirstLocation = oldLocations[0];

      if (newFirstLocation?.contacts) {
        const newContacts = newFirstLocation.contacts;
        const oldContacts = oldFirstLocation?.contacts || [];

        if (JSON.stringify(oldContacts) !== JSON.stringify(newContacts)) {
          console.log("\nContacts:");
          displayFieldDiff("contacts", oldContacts, newContacts, 1);
        }
      }
    }
  }

  // Check social links
  if (newOrg.socialLinks) {
    const oldSocialLinks = oldOrg.socialLinks || [];
    const newSocialLinks = newOrg.socialLinks;

    if (JSON.stringify(oldSocialLinks) !== JSON.stringify(newSocialLinks)) {
      console.log("\nSocial Links:");
      displayFieldDiff("socialLinks", oldSocialLinks, newSocialLinks, 1);
    }
  }

  // Check locations
  if (newOrg.locations) {
    const oldLocations = oldOrg.locations || [];
    const newLocations = newOrg.locations;

    if (JSON.stringify(oldLocations) !== JSON.stringify(newLocations)) {
      console.log("\nLocations:");
      displayFieldDiff("locations", oldLocations, newLocations, 1);
    }
  }

  console.log("=".repeat(50));
}

/**
 * Display program changes diff
 */
export function displayProgramDiff(
  oldProgram: Record<string, unknown>,
  newProgram: Record<string, unknown>,
): void {
  console.log("\n📊 Program Changes:");
  console.log("=".repeat(50));

  // Check each field
  const fieldsToCheck = [
    "name",
    "quickFacts",
    "whatYouWillLearn",
    "description",
    "tagline",
    "outcome",
  ];

  for (const field of fieldsToCheck) {
    const oldValue = oldProgram[field];
    const newValue = newProgram[field];

    if (oldValue !== newValue) {
      displayFieldDiff(field, oldValue, newValue);
    }
  }

  // Check pricing (stored in _extractedPricing)
  if (newProgram._extractedPricing) {
    const oldPricing = oldProgram._extractedPricing;
    const newPricing = newProgram._extractedPricing;

    if (JSON.stringify(oldPricing) !== JSON.stringify(newPricing)) {
      console.log("\nPricing:");
      displayFieldDiff("pricing", oldPricing, newPricing, 1);
    }
  }

  // Check schedule (stored in _extractedSchedule)
  if (newProgram._extractedSchedule) {
    const oldSchedule = oldProgram._extractedSchedule;
    const newSchedule = newProgram._extractedSchedule;

    if (JSON.stringify(oldSchedule) !== JSON.stringify(newSchedule)) {
      console.log("\nSchedule:");
      displayFieldDiff("schedule", oldSchedule, newSchedule, 1);
    }
  }

  console.log("=".repeat(50));
}
