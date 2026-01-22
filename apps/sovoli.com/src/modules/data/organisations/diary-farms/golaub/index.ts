import type { OrgInstance } from "~/modules/organisations/types";
import { parseOrgInstance } from "../../utils/parseOrgInstance";
import needsData from "./needs.json";
// Import JSON files
import orgData from "./org.json";
import projectsData from "./projects.json";

/**
 * Golaub Dairy Farm organization instance
 * All data is loaded from JSON files and parsed through utility functions
 */
export const GOLAUB_DAIRY_FARM_ORG: OrgInstance = parseOrgInstance({
  jsonData: {
    org: orgData,
    needs: needsData,
    projects: projectsData,
  },
});
