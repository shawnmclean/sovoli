// Common suffixes that can be used for program names
export const PROGRAM_SUFFIXES = [
  "Training",
  "Course",
  "Program",
  "Programme",
  "Classes",
  "Class",
  "Workshop",
  "Seminar",
  "Certification",
  "Certificate",
] as const;

export type ProgramSuffix = (typeof PROGRAM_SUFFIXES)[number];

/**
 * Check if a string ends with any of the common suffixes (case-insensitive)
 */
export function hasSuffix(name: string): boolean {
  const lowerName = name.toLowerCase().trim();
  return PROGRAM_SUFFIXES.some((suffix) =>
    lowerName.endsWith(suffix.toLowerCase()),
  );
}

/**
 * Remove any existing suffix from a program name
 */
export function removeSuffix(name: string): string {
  const trimmed = name.trim();
  const lowerTrimmed = trimmed.toLowerCase();

  // Find and remove the first matching suffix (longest first to avoid partial matches)
  const sortedSuffixes = [...PROGRAM_SUFFIXES].sort(
    (a, b) => b.length - a.length,
  );

  for (const suffix of sortedSuffixes) {
    const lowerSuffix = suffix.toLowerCase();
    if (lowerTrimmed.endsWith(lowerSuffix)) {
      // Remove the suffix (including any space before it)
      // Check if there's a space before the suffix
      const suffixIndex = trimmed.length - suffix.length;
      if (suffixIndex > 0 && trimmed[suffixIndex - 1] === " ") {
        // Remove space + suffix
        return trimmed.slice(0, suffixIndex - 1).trim();
      } else {
        // Just remove the suffix
        return trimmed.slice(0, suffixIndex).trim();
      }
    }
  }

  return trimmed;
}

/**
 * Replace any existing suffix with a new one, or add if none exists
 */
export function replaceSuffix(
  name: string,
  newSuffix: ProgramSuffix | null,
): string {
  if (!newSuffix) {
    // If no suffix selected, just remove any existing suffix
    return removeSuffix(name);
  }

  // Remove any existing suffix first
  const baseName = removeSuffix(name);

  // Add the new suffix
  return `${baseName} ${newSuffix}`;
}
