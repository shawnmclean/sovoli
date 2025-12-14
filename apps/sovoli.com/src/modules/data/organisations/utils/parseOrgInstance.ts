import type { OrgInstance } from "~/modules/organisations/types";
import { parseOrgModule } from "./parseOrgModule";
import { parseNeedsModule } from "./parseNeedsModule";
import { parseProjectsModule } from "./parseProjectsModule";
import { parseWebsiteModule } from "./parseWebsiteModule";
import { parseCatalogModule } from "./parseCatalogModule";
import { parseWorkforceModule } from "./parseWorkforceModule";
import { parseMediaModule, type MediaMap } from "./parseMediaModule";
import {
  parseCyclesModule,
  type ParsedCyclesModule,
} from "./parseCyclesModule";
import { parseAcademicModule } from "./parseAcademicModule";

/**
 * JSON data for parsing an organization instance
 * All fields are optional except org - other modules can be omitted if not needed
 */
export interface OrgInstanceJsonData {
  /** Required: Core organization data */
  org: unknown;
  /** Optional: Media module data (central registry of all media) */
  media?: unknown;
  /** Optional: Workforce module data */
  workforce?: unknown;
  /** Optional: Cycles module data (academic and program cycles) */
  cycles?: unknown;
  /** Optional: Academic module data (programs) */
  academic?: unknown;
  /** Optional: Needs module data */
  needs?: unknown;
  /** Optional: Projects module data */
  projects?: unknown;
  /** Optional: Website module data */
  website?: unknown;
  /** Optional: Catalog module data */
  catalog?: unknown;
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
 * Handles module dependencies following the parse order:
 * 1. media.json (no dependencies)
 * 2. workforce.json (depends on media)
 * 3. cycles.json (depends on workforce)
 * 4. programs.json (depends on media, cycles)
 *
 * @param options - Options for parsing including JSON data and optional existing instance
 * @returns Complete OrgInstance with all modules parsed and dependencies resolved
 * @throws Error if required data is missing or if parsing/validation fails
 */
export function parseOrgInstance(
  options: ParseOrgInstanceOptions,
): OrgInstance {
  const { jsonData, existingInstance } = options;

  // Step 1: Parse media module first (no dependencies, needed by org for logoPhotoId resolution)
  let mediaMap: MediaMap | undefined;
  if (jsonData.media) {
    mediaMap = parseMediaModule(jsonData.media);
  }

  // Step 2: Parse org.json (required - core data including username)
  // Pass mediaMap to resolve logoPhotoId reference
  const org = parseOrgModule(jsonData.org, { mediaMap });

  // Use existing org if provided, otherwise use parsed org
  const finalOrg = existingInstance?.org ?? org;

  // Step 3: Parse workforce module (depends on media for photos)
  const workforceModule = jsonData.workforce
    ? parseWorkforceModule(jsonData.workforce, { mediaMap })
    : (existingInstance?.workforceModule ?? null);

  // Step 4: Parse cycles module (depends on workforce for teachers)
  let cyclesModule: ParsedCyclesModule | undefined;
  if (jsonData.cycles) {
    cyclesModule = parseCyclesModule(jsonData.cycles, {
      workforceModule: workforceModule ?? undefined,
    });
  }

  // Step 5: Parse academic module (depends on media and cycles)
  const academicModule = jsonData.academic
    ? parseAcademicModule(jsonData.academic, { mediaMap, cyclesModule })
    : (existingInstance?.academicModule ?? null);

  // Step 6: Parse needs module (depends on workforce for job needs)
  const needsModule = jsonData.needs
    ? parseNeedsModule(jsonData.needs, {
        workforceModule,
      })
    : (existingInstance?.needsModule ?? null);

  // Step 7: Parse projects module (depends on needs module)
  const projectsModule =
    jsonData.projects && needsModule
      ? parseProjectsModule(jsonData.projects, needsModule)
      : (existingInstance?.projectsModule ?? null);

  // Step 8: Parse website module (depends on username for domain generation)
  const websiteModule = jsonData.website
    ? parseWebsiteModule(jsonData.website, finalOrg.username)
    : (existingInstance?.websiteModule ?? null);

  // Step 9: Parse catalog module (no dependencies)
  const catalogModule = jsonData.catalog
    ? parseCatalogModule(jsonData.catalog)
    : (existingInstance?.catalogModule ?? null);

  // Build and return the complete OrgInstance
  const orgInstance: OrgInstance = {
    org: finalOrg,
    websiteModule,
    academicModule,
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
