import fs from "fs";
import path from "path";
import type { MatchedOrg } from "../types/lead-extraction-schema";

// In Next.js, process.cwd() points to the project root (apps/sovoli.com)
// We need to go up two levels to get to the monorepo root
const ROOT_DIR = path.resolve(process.cwd(), "../..");
const ORGS_DIR = path.join(
  ROOT_DIR,
  "apps/sovoli.com/src/modules/data/organisations",
);

/**
 * Find organization directory from org ID (username)
 */
function findOrganizationDirectory(orgId: string): string | null {
  if (!fs.existsSync(ORGS_DIR)) {
    return null;
  }

  // Recursively search for org directory
  function searchDirectory(dir: string): string | null {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        const orgJsonPath = path.join(fullPath, "org.json");

        if (fs.existsSync(orgJsonPath)) {
          try {
            const content = fs.readFileSync(orgJsonPath, "utf-8");
            const orgData = JSON.parse(content) as {
              username: string;
            };

            if (orgData.username === orgId) {
              return fullPath;
            }
          } catch {
            // Continue searching
          }
        }

        // Recurse into subdirectories
        const found = searchDirectory(fullPath);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  return searchDirectory(ORGS_DIR);
}

/**
 * Load org.json file from organization directory
 */
export function loadOrgFile(orgId: string): Record<string, unknown> | null {
  const orgDir = findOrganizationDirectory(orgId);
  if (!orgDir) {
    return null;
  }

  const orgJsonPath = path.join(orgDir, "org.json");
  if (!fs.existsSync(orgJsonPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(orgJsonPath, "utf-8");
    return JSON.parse(content) as Record<string, unknown>;
  } catch (error) {
    console.error(`Error loading org.json from ${orgJsonPath}:`, error);
    return null;
  }
}

/**
 * Match extraction to existing organization
 * Returns the matched org data if found, null otherwise
 */
export function matchOrg(matchedOrgs: MatchedOrg[] | null | undefined): {
  orgId: string;
  orgDir: string;
  orgData: Record<string, unknown>;
} | null {
  if (!matchedOrgs || matchedOrgs.length === 0) {
    return null;
  }

  // Use the first matched org (highest score)
  const matchedOrg = matchedOrgs[0];
  if (!matchedOrg) {
    return null;
  }

  const orgDir = findOrganizationDirectory(matchedOrg.id);
  if (!orgDir) {
    return null;
  }

  const orgData = loadOrgFile(matchedOrg.id);
  if (!orgData) {
    return null;
  }

  return {
    orgId: matchedOrg.id,
    orgDir,
    orgData,
  };
}

/**
 * Get organization directory path for a given org ID
 */
export function getOrgDirectory(orgId: string): string | null {
  return findOrganizationDirectory(orgId);
}
