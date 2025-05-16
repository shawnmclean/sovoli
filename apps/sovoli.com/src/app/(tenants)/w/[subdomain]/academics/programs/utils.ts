import type { AgeRange } from "../../programsData";

export function displayAgeRange(ageRange?: AgeRange): string {
  if (!ageRange) return "";

  const minAgeParts: string[] = [];
  const maxAgeParts: string[] = [];

  // Build minimum age string
  if (ageRange.minAgeYears !== undefined && ageRange.minAgeYears > 0) {
    minAgeParts.push(`${ageRange.minAgeYears} years`);
  }
  if (ageRange.minAgeMonths !== undefined && ageRange.minAgeMonths > 0) {
    minAgeParts.push(`${ageRange.minAgeMonths} months`);
  }

  // Build maximum age string
  if (ageRange.maxAgeYears !== undefined && ageRange.maxAgeYears > 0) {
    maxAgeParts.push(`${ageRange.maxAgeYears} years`);
  }
  if (ageRange.maxAgeMonths !== undefined && ageRange.maxAgeMonths > 0) {
    maxAgeParts.push(`${ageRange.maxAgeMonths} months`);
  }

  // Combine min and max age into a single display string
  const minAgeDisplay = minAgeParts.join(" ");
  const maxAgeDisplay = maxAgeParts.join(" ");

  if (minAgeDisplay && maxAgeDisplay) {
    return `${minAgeDisplay} - ${maxAgeDisplay}`;
  } else if (minAgeDisplay) {
    return minAgeDisplay;
  } else if (maxAgeDisplay) {
    return maxAgeDisplay;
  }

  return "";
}
