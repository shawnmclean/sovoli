import type { AgeRange } from "~/modules/academics/types";

export function displayAgeRange(ageRange?: AgeRange): string {
  if (!ageRange) return "";

  const min = ageRange.minAgeYears ?? 0;
  return ageRange.maxAgeYears
    ? `Ages ${min}-${ageRange.maxAgeYears}`
    : `Ages ${min} and up`;
}
