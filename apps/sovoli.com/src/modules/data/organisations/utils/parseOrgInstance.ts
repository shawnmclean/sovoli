import type { OrgInstance } from "~/modules/organisations/types";
import { parseOrgModule } from "./parseOrgModule";
import { parseNeedsModule } from "./parseNeedsModule";
import { parseProjectsModule } from "./parseProjectsModule";
import { parseWebsiteModule } from "./parseWebsiteModule";
import { parseCatalogModule } from "./parseCatalogModule";
import { parseWorkforceModule } from "./parseWorkforceModule";

/**
 * JSON data for parsing an organization instance
 * All fields are optional except org - other modules can be omitted if not needed
 */
export interface OrgInstanceJsonData {
  /** Required: Core organization data */
  org: unknown;
  /** Optional: Needs module data */
  needs?: unknown;
  /** Optional: Projects module data */
  projects?: unknown;
  /** Optional: Website module data */
  website?: unknown;
  /** Optional: Catalog module data */
  catalog?: unknown;
  /** Optional: Workforce module data */
  workforce?: unknown;
}

/**
 * Options for parsing an organization instance from JSON data
 */
export interface ParseOrgInstanceOptions {
  /**
   * JSON data for all modules
   */
  jsonData: OrgInstanceJsonData;
  
  /**
   * Optional partial OrgInstance for dependency injection
   * Can be used to pass already-parsed modules or inject dependencies
   */
  existingInstance?: Partial<OrgInstance>;
}

/**
 * Main orchestrator function that parses all JSON data for an organization.
 * Handles module dependencies (e.g., projects depends on needs).
 *
 * @param options - Options for parsing including JSON data and optional existing instance
 * @returns Complete OrgInstance with all modules parsed and dependencies resolved
 * @throws Error if required data is missing or if parsing/validation fails
 */
export function parseOrgInstance(
  options: ParseOrgInstanceOptions,
): OrgInstance {
  const { jsonData, existingInstance } = options;

  // Step 1: Parse org.json (required - core data including username)
  const org = parseOrgModule(jsonData.org);

  // Use existing org if provided, otherwise use parsed org
  const finalOrg = existingInstance?.org ?? org;

  // Step 2: Parse workforce module (if present, needed for job needs)
  const workforceModule = jsonData.workforce
    ? parseWorkforceModule(jsonData.workforce)
    : existingInstance?.workforceModule ?? null;

  // Step 3: Parse needs module (depends on workforce for job needs)
  const needsModule = jsonData.needs
    ? parseNeedsModule(jsonData.needs, {
        workforceModule,
      })
    : existingInstance?.needsModule ?? null;

  // Step 4: Parse projects module (depends on needs module)
  const projectsModule =
    jsonData.projects && needsModule
      ? parseProjectsModule(jsonData.projects, needsModule)
      : existingInstance?.projectsModule ?? null;

  // Step 5: Parse website module (depends on username for domain generation)
  const websiteModule = jsonData.website
    ? parseWebsiteModule(jsonData.website, finalOrg.username)
    : existingInstance?.websiteModule ?? null;

  // Step 6: Parse catalog module (no dependencies)
  const catalogModule = jsonData.catalog
    ? parseCatalogModule(jsonData.catalog)
    : existingInstance?.catalogModule ?? null;

  // Build and return the complete OrgInstance
  const orgInstance: OrgInstance = {
    org: finalOrg,
    websiteModule,
    academicModule: existingInstance?.academicModule ?? null,
    serviceModule: existingInstance?.serviceModule ?? null,
    workforceModule,
    scoringModule: existingInstance?.scoringModule ?? null,
    catalogModule,
    eventModule: existingInstance?.eventModule ?? null,
    needsModule,
    projectsModule,
  };

  return orgInstance;
}
