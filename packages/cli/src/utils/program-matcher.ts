import type { ProgramInfo, ProgramCycleInfo } from "./program-discovery.js";
import { calculateSimilarity, type ScoredMatch } from "./org-matcher.js";

/**
 * Find all potential program matches for a program name
 * Returns all matches with similarity score >= threshold, sorted by score (descending)
 */
export function findAllProgramMatches(
  programName: string,
  programs: ProgramInfo[],
  threshold: number = 0.3,
): ScoredMatch<ProgramInfo>[] {
  if (programs.length === 0) {
    return [];
  }

  const matches: ScoredMatch<ProgramInfo>[] = [];

  for (const program of programs) {
    const score = calculateSimilarity(programName, program.name);

    if (score >= threshold) {
      matches.push({
        match: program,
        score,
      });
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Find the best matching cycle for a program
 * Matches cycles that belong to the program (from program's cycleIds)
 */
export function findBestCycleMatch(
  programCycleIds: string[] | undefined,
  cycles: ProgramCycleInfo[],
): ProgramCycleInfo | null {
  if (!programCycleIds || programCycleIds.length === 0) {
    return null;
  }

  if (cycles.length === 0) {
    return null;
  }

  // Create a map of cycles by ID for quick lookup
  const cyclesMap = new Map<string, ProgramCycleInfo>();
  for (const cycle of cycles) {
    cyclesMap.set(cycle.id, cycle);
  }

  // Find the first cycle that matches one of the program's cycleIds
  for (const cycleId of programCycleIds) {
    const cycle = cyclesMap.get(cycleId);
    if (cycle) {
      return cycle;
    }
  }

  return null;
}
