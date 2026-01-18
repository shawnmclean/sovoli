import { parseLeadsModule } from "~/modules/data/organisations/utils/parseLeadsModule";
import type { Lead } from "~/modules/leads/types";

// Scrappy: we only have JSON leads for the pilot tenant right now.
import healingEmeraldLeadsData from "~/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json";

export function isLeadsConfiguredForOrg(username: string): boolean {
  return username === "healingemeraldwellness";
}

export function getLeadsForOrg(username: string): Lead[] {
  if (!isLeadsConfiguredForOrg(username)) return [];

  const leadsModule = parseLeadsModule(healingEmeraldLeadsData);
  return leadsModule.leads;
}

