import { parseOrgInstance } from "~/modules/data/organisations/utils/parseOrgInstance";
import type { OrgInstance } from "~/modules/organisations/types";
import needsData from "./needs.json";
// Import JSON files
import orgData from "./org.json";
import projectsData from "./projects.json";

/**
 * Alderton Primary and Infant School organization instance
 * All data is loaded from JSON files and parsed through utility functions
 */
export const ALDERTON_PRIMARY_AND_INFANT_SCHOOL_ORG: OrgInstance =
  parseOrgInstance({
    jsonData: {
      org: orgData,
      needs: needsData,
      projects: projectsData,
    },
  });
