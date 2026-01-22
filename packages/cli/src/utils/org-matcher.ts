import type { OrgInfo } from "./org-discovery.js";

/**
 * Normalize a string for comparison
 * - Convert to lowercase
 * - Remove punctuation
 * - Trim whitespace
 * - Handle common abbreviations (Ltd, LLC, Inc, etc.)
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Replace punctuation with spaces
    .replace(
      /\b(ltd|limited|llc|inc|incorporated|corp|corporation|co|company|spa|training|centre|center|academy)\b/gi,
      "",
    ) // Remove common business suffixes
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i]![0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0]![j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
      } else {
        dp[i]![j] = Math.min(
          dp[i - 1]![j]! + 1, // deletion
          dp[i]![j - 1]! + 1, // insertion
          dp[i - 1]![j - 1]! + 1, // substitution
        );
      }
    }
  }

  return dp[m]![n]!;
}

/**
 * Calculate similarity score between two strings (0-1)
 * - Exact match after normalization: 1.0
 * - Substring match (one contains the other): 0.8
 * - Levenshtein similarity ratio: (maxLength - distance) / maxLength
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);

  // Exact match after normalization
  if (normalized1 === normalized2) {
    return 1.0;
  }

  // Substring match (one contains the other)
  if (normalized1.length > 0 && normalized2.length > 0) {
    if (
      normalized1.includes(normalized2) ||
      normalized2.includes(normalized1)
    ) {
      return 0.8;
    }
  }

  // Levenshtein similarity ratio
  const maxLength = Math.max(normalized1.length, normalized2.length);
  if (maxLength === 0) {
    return 0;
  }

  const distance = levenshteinDistance(normalized1, normalized2);
  const similarity = (maxLength - distance) / maxLength;

  return Math.max(0, similarity);
}

export interface ScoredMatch<T> {
  match: T;
  score: number;
}

/**
 * Find all potential organization matches for a business name
 * Returns all matches with similarity score >= threshold, sorted by score (descending)
 */
export function findAllMatches<T extends { name: string }>(
  businessName: string,
  candidates: T[],
  threshold: number = 0.3,
): ScoredMatch<T>[] {
  if (candidates.length === 0) {
    return [];
  }

  const matches: ScoredMatch<T>[] = [];

  for (const candidate of candidates) {
    const score = calculateSimilarity(businessName, candidate.name);

    if (score >= threshold) {
      matches.push({
        match: candidate,
        score,
      });
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}
