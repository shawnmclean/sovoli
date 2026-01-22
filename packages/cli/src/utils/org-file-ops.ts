import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ChangeMetadata } from "./change-tracking.js";
import { findOrganizationDirectory } from "./program-discovery.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../../../");

const ORGS_DIR = path.join(
  ROOT_DIR,
  "apps/sovoli.com/src/modules/data/organisations",
);

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
 * Save org.json file with change tracking metadata
 */
export function saveOrgFile(
  orgId: string,
  orgData: Record<string, unknown>,
  changes: ChangeMetadata,
): void {
  const orgDir = findOrganizationDirectory(orgId);
  if (!orgDir) {
    throw new Error(`Organization directory not found for ${orgId}`);
  }

  const orgJsonPath = path.join(orgDir, "org.json");

  // Apply change tracking metadata
  const orgWithMetadata = { ...orgData };

  if (changes.isNew) {
    (orgWithMetadata as { _addedAt?: string })._addedAt = changes.timestamp;
    (orgWithMetadata as { _source?: string })._source = changes.source;
  } else {
    (orgWithMetadata as { _updatedAt?: string })._updatedAt = changes.timestamp;
    (orgWithMetadata as { _updatedFields?: string[] })._updatedFields =
      changes.updatedFields;
    (orgWithMetadata as { _source?: string })._source = changes.source;
  }

  // Write to file
  const content = JSON.stringify(orgWithMetadata, null, 2) + "\n";
  fs.writeFileSync(orgJsonPath, content, "utf-8");
}

/**
 * Apply changes to org data and add metadata
 */
export function applyOrgChanges(
  orgData: Record<string, unknown>,
  updates: Record<string, unknown>,
  changes: ChangeMetadata,
): Record<string, unknown> {
  // Merge updates into org data
  const updated = { ...orgData, ...updates };

  // Handle nested updates (e.g., locations array)
  if (updates.locations && Array.isArray(updates.locations)) {
    updated.locations = updates.locations;
  }

  if (updates.socialLinks && Array.isArray(updates.socialLinks)) {
    updated.socialLinks = updates.socialLinks;
  }

  // Apply change tracking metadata
  if (changes.isNew) {
    (updated as { _addedAt?: string })._addedAt = changes.timestamp;
    (updated as { _source?: string })._source = changes.source;
  } else {
    (updated as { _updatedAt?: string })._updatedAt = changes.timestamp;
    (updated as { _updatedFields?: string[] })._updatedFields =
      changes.updatedFields;
    (updated as { _source?: string })._source = changes.source;
  }

  return updated;
}

/**
 * Create new org directory and org.json file
 */
export function createNewOrg(
  orgData: Record<string, unknown>,
  category: string,
  country: string,
  region: string | undefined,
  source: string,
): string {
  // Build directory path
  const pathParts = [category, country];
  if (region) {
    pathParts.push(region);
  }

  const username = orgData.username as string;
  if (!username) {
    throw new Error("Username is required for new org");
  }

  pathParts.push(username);
  const orgDir = path.join(ORGS_DIR, ...pathParts);

  // Create directory if it doesn't exist
  if (!fs.existsSync(orgDir)) {
    fs.mkdirSync(orgDir, { recursive: true });
  }

  // Create org.json with metadata
  const orgWithMetadata = {
    ...orgData,
    _addedAt: new Date().toISOString(),
    _source: source,
  };

  const orgJsonPath = path.join(orgDir, "org.json");
  const content = JSON.stringify(orgWithMetadata, null, 2) + "\n";
  fs.writeFileSync(orgJsonPath, content, "utf-8");

  return orgDir;
}
